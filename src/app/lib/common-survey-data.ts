import * as SurveyTypes from "./survey-types";

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
  vlmQuestion: string,
  vlmAnswers: string[],
  images: string[]
): SurveyTypes.SurveyContent[][] => {
  if (vlmAnswers.length !== images.length) {
    throw new Error("vlmAnswers and images must have the same length");
  }

  return images.flatMap((image, index) => [
    [
      {
        type: "info",
        lines: [scenarioDescription],
        image,
      },
      {
        title: "I am comfortable with this image being processed by a Visual-Language Model (VLM).",
        ...AgreeDisagreeOptions,
      },
      {
        title: "I am concerned that personal information from this image could be used maliciously.",
        ...AgreeDisagreeOptions,
      },
      {
        title: "I am concerned that personal information from this image could be used for profiling, for example, to deliver targeted advertisements and/or biometrically identify me.",
        ...AgreeDisagreeOptions,
      },
      {
        title: `We asked the Visual-Language Model (VLM): ${vlmQuestion} What do you think its answer will be?`,
        type: "text",
        value: "",
      },
    ],
    [
      {
        type: "info",
        lines: [],
        image,
      },
      {
        title: `The Visual-Language Model (VLM) answered: ${vlmAnswers[index]}, how was the quality of its answer`,
        type: "radio",
        options: [
          { type: "choose", value: "Extremely bad" },
          { type: "choose", value: "Bad" },
          { type: "choose", value: "Neither bad nor good" },
          { type: "choose", value: "Good" },
          { type: "choose", value: "Extremely good" },
        ],
      },
    ],
  ]);
};