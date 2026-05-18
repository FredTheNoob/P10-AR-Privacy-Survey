import type { ChooseRadioOption, InformationPage, Question, SurveyContent, SurveyData, TextRadioOption } from "~/app/lib/survey-types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { CensoringMethod, type Scenario, type SurveyQuestion } from "@prisma/client";

export function toSurveyData(rows: SurveyQuestion[]): SurveyData {
  const surveyData: SurveyData = { pages: [] }
  const pages: SurveyContent[][] = [];

  for (const row of rows.sort((a, b) => (a.pageIndex ?? 0) - (b.pageIndex ?? 0))) {
    const page = row.pageIndex ?? 0;

    const config = (row.config ?? {}) as {
      options?: (ChooseRadioOption | TextRadioOption)[] | string[];
      min?: number;
      max?: number;
      value?: string;
      lines?: { type: string, src: string }[];
      multiline?: boolean;
      footer?: string;
    };

    // Initialize page if missing
    pages[page] ??= row.type === "info" ? [] as InformationPage[] : [] as Question[];


    if (row.type === "info") {
      (pages[page] as InformationPage[]).push({
        id: row.id,
        type: "info",
        lines: config.lines ?? [],
        image: row.imageName ?? undefined,
        footer: config.footer ?? undefined,
      });
    } else {
      const base = {
        visible: row.visible,
        isScenario: row.isScenario,
        id: row.id,
        title: row.title ?? "",
        required: row.required ?? undefined,
        isAIAnswer: row.isAIAnswer,
      };

      switch (row.type) {
        case "number":
          (pages[page] as Question[]).push({
            ...base,
            type: "number",
            min: config.min,
            max: config.max,
          });
          break;
        case "radio":
          (pages[page] as Question[]).push({
            ...base,
            type: "radio",
            options: (config.options as (ChooseRadioOption | TextRadioOption)[]) ?? [],
          });
          break;
        case "rank":
          (pages[page] as Question[]).push({
            ...base,
            type: "rank",
            options: (config.options as string[]) ?? [],
          });
          break;
        case "text":
          (pages[page] as Question[]).push({
            ...base,
            type: "text",
            value: config.value ?? "",
            multiline: config.multiline,
          });
          break;
      }
    }
  }

  
  pages[0] = [];
  const compactPages = pages.filter(p => p !== undefined);

  surveyData.pages = compactPages

  return surveyData;
}

export const surveyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Get a random Censoring Method from the database and remove it
    const count = await ctx.db.randomCensoringMethod.count()

    const randomIndex = Math.floor(Math.random() * count)

    const randomMethod = await ctx.db.randomCensoringMethod.findFirst({
      skip: randomIndex,
    })

    if (!randomMethod) throw new Error('Failed to get random censoring method')

    await ctx.db.randomCensoringMethod.delete({
      where: {
        censoringMethod: randomMethod.censoringMethod,
      },
    })
    
    // If no more Censoring Methods in the database refill
    if (count == 1) {
      await ctx.db.randomCensoringMethod.createMany({
        data: [
          { censoringMethod: CensoringMethod.BLUR },
          { censoringMethod: CensoringMethod.BLACK_BOX },
          { censoringMethod: CensoringMethod.GEN_CENSORING },
        ],
        skipDuplicates: true,
      })
    }
    
    // Get Survey Questions based on the Censoring Method
    const rows = await ctx.db.surveyQuestion.findMany({
      where: {
        OR: [
          { censoringMethod: randomMethod.censoringMethod },
          { censoringMethod: CensoringMethod.NONE },
          { isScenario: false },
        ],
      },
      orderBy: [
        { pageIndex: "asc" },
        { questionIndex: "asc" },
      ],
    });
    
    // Randomly select 3 scenarios to be None and 3 to be the randomly selected method
    const byScenario = new Map<Scenario, SurveyQuestion[]>();

    for (const row of rows) {
      const key = row.scenario;
      if (key == null) continue;
      if (!byScenario.has(key)) byScenario.set(key, []);
      byScenario.get(key)!.push(row);
    }

    const scenarios = Array.from(byScenario.keys());

    // Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
    for (let i = scenarios.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scenarios[i], scenarios[j]] = [scenarios[j]!, scenarios[i]!];
    }

    const selectedNone = scenarios.slice(0, 3);
    const selectedRandom = scenarios.slice(3, 6);

    const isScenarioRow = (row: SurveyQuestion) => row.isScenario == true;

    let firstScenarioIndex = -1;
    let lastScenarioIndex = -1;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;

      if (isScenarioRow(row)) {
        if (firstScenarioIndex === -1) firstScenarioIndex = i;
        lastScenarioIndex = i;
      }
    }

    const scenarioRows: SurveyQuestion[] = [];

    const introRows =
      firstScenarioIndex !== -1
        ? rows.slice(0, firstScenarioIndex)
        : [];

    const outroRows =
      lastScenarioIndex !== -1
        ? rows.slice(lastScenarioIndex + 1)
        : [];

    for (const id of selectedNone) {
      const scenario = byScenario.get(id)!;

      scenarioRows.push(
        ...scenario.filter(r => r.censoringMethod === CensoringMethod.NONE)
      );
    }

    for (const id of selectedRandom) {
      const scenario = byScenario.get(id)!;

      scenarioRows.push(
        ...scenario.filter(r => r.censoringMethod === randomMethod.censoringMethod)
      );
    }

    const selectedRows: SurveyQuestion[] = [
      ...introRows.flat(),
      ...scenarioRows,
      ...outroRows.flat(),
    ];

    const data = toSurveyData(selectedRows);

    const isScenarioPage = (page: SurveyContent[]) =>
      page.some((item) => "isScenario" in item && item.isScenario === true);

    let start = -1;
    let end = -1;

    for (let i = 0; i < data.pages.length; i++) {
      const page = data.pages[i];
      if (page && isScenarioPage(page)) {
        if (start === -1) start = i;
        end = i + 1;
      } else if (start !== -1) {
        break;
      }
    }

    if (start !== -1 && end !== -1) {
      const scenarioPages = data.pages.slice(start, end).filter(
        (page): page is SurveyContent[] => Array.isArray(page)
      );

      const pairs: [SurveyContent[], SurveyContent[]][] = [];
      for (let i = 0; i + 1 < scenarioPages.length; i += 2) {
        const first = scenarioPages[i];
        const second = scenarioPages[i + 1];
        if (!first || !second) continue;
        pairs.push([first, second]);
      }

      // Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
      for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = pairs[i];
        const b = pairs[j];
        if (!a || !b) continue;
        pairs[i] = b;
        pairs[j] = a;
      }

      const shuffled = pairs.flat();
      data.pages.splice(start, shuffled.length, ...shuffled);
    }

    return data;
  }),
});