import type * as SurveyTypes from "./survey-types";

export const AgreeDisagreeOptions: { options: SurveyTypes.ChooseRadioOption[], type: "radio" } = {
    type: "radio",
    options: [
        {
            type: "choose",
            value: "Strongly disagree"
        },
        {
            type: "choose",
            value: "Disagree"
        },
        {
            type: "choose",
            value: "Neutral"
        },
        {
            type: "choose",
            value: "Agree"
        },
        {
            type: "choose",
            value: "Strongly agree"
        }
    ]
}

export const ScenarioQuestions = (
  scenarioDescription: string,
  aiQuestion: string,
  aiAnswers: string[],
  images: string[],
  disclaimImageHasBeenProcessed = false,
): SurveyTypes.SurveyContent[][] => {
  if (aiAnswers.length !== images.length) {
    throw new Error("aiAnswers and images must have the same length");
  }

  const processedDisclaimer = disclaimImageHasBeenProcessed    ? "The image has been processed to remove privacy sensitive information."
    : "The image has not been processed, so it may contain privacy sensitive information.";

  return images.flatMap((image, index) => [
    [
      {
        isScenario: true,
        type: "info",
        lines: [scenarioDescription, `❓ We asked the AI: "${aiQuestion}"`],
        footer: processedDisclaimer,
        image,
      },
      {
        isScenario: true,
        title: "I am comfortable with this image being processed by an AI system.",
        ...AgreeDisagreeOptions,
      },
      {
        isScenario: true,
        title: "I am concerned that personal information from this image could be used maliciously.",
        ...AgreeDisagreeOptions,
      },
      {
        isScenario: true,
        title: "I am concerned that personal information from this image could be used for profiling, for example, to deliver targeted advertisements and/or biometrically identify me.",
        ...AgreeDisagreeOptions,
      },
      {
        isScenario: true,
        title: `What do you think the AI's answer will be?`,
        type: "text",
        value: "",
        multiline: true,
      },
    ],
    [
      {
        isScenario: true,
        type: "info",
        lines: [],
        image,
      },
      {
        isScenario: true,
        title: `💬 The AI answered: "${aiAnswers[index]}" I think the answer is of good quality.`,
        ...AgreeDisagreeOptions,
      },
    ],
  ]);
};