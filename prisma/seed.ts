import { PrismaClient } from "@prisma/client";
import { SURVEY_DATA, type Question, type InformationPage } from "./survey-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.surveyQuestion.createMany({
    data: SURVEY_DATA.pages.flatMap((page, pageIndex) =>
      page
        .map((q) => ({
          title: "title" in q ? q.title : null,
          type: q.type,
          imageName: "image" in q ? q.image : null,
          pageIndex, // ✅ correct page grouping
          config: {
            options: "options" in q ? q.options : null,
            min: "min" in q ? q.min : null,
            max: "max" in q ? q.max : null,
            value: "value" in q ? q.value : null,
            lines: "lines" in q ? q.lines : null,
          },
          required: "required" in q ? q.required : true,
        }))
    )})
}

main()
  .then(() => {
    console.log("Seeding complete");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });