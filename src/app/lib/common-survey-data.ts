import { CensoringMethod, type Scenario } from "@prisma/client";
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
  scenarioType: Scenario,
  scenarioDescription: string,
  aiQuestion: string,
  scenarios: SurveyTypes.ScenarioQuestions,
): SurveyTypes.SurveyContent[][] => {
  let disclaimer = "";
  const processedDisclaimer = "The image has been processed to remove privacy sensitive information.";
  const notProcessedDisclaimer = "The image has not been processed, so it may contain privacy sensitive information.";

  return scenarios.flatMap((scenario) => {
    const baseScenarioQuestion = {
      censoringMethod: scenario.censoringMethod,
      scenario: scenarioType,
      isScenario: true,
    };

    switch (scenario.censoringMethod) {
      case CensoringMethod.BLACK_BOX:
        disclaimer = `${processedDisclaimer} It uses a black box censoring method`;
        break;
    
      case CensoringMethod.BLUR:
        disclaimer = `${processedDisclaimer} It uses a blur censoring method`;
        break;

      case CensoringMethod.GEN_CENSORING:
        disclaimer = `${processedDisclaimer} It uses a generative censoring method`;
        break;
      case CensoringMethod.NONE:
        disclaimer = `${notProcessedDisclaimer} It uses no censoring method`;
        break;
    }

    return [
      [
        {
          isScenario: true,
          type: "info",
          title: aiQuestion,
          lines: [{type: "text", src: `${scenarioDescription}\n ❓ We asked the AI: "${aiQuestion}`}],
          footer: disclaimer,
          image: scenario.image,
        },
        {
          ...baseScenarioQuestion,
          censoringMethod: scenario.censoringMethod,
          title: "I am comfortable with this image being processed by an AI system.",
          ...AgreeDisagreeOptions,
        },
        {
          ...baseScenarioQuestion,
          title: "I am concerned that personal information from this image could be used maliciously.",
          ...AgreeDisagreeOptions,
        },
        {
          ...baseScenarioQuestion,
          title:
            "I am concerned that personal information from this image could be used for profiling, for example, to deliver targeted advertisements and/or biometrically identify me.",
          ...AgreeDisagreeOptions,
        },
        {
          ...baseScenarioQuestion,
          title: "What do you think the AI's answer will be?",
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
          title: scenario.aiAnswer,
          image: scenario.image,
          censoringMethod: scenario.censoringMethod,
        },
        {
          ...baseScenarioQuestion,
          title: `💬 The AI answered: "${scenario.aiAnswer}"\n I think the answer is of good quality.`,
          ...AgreeDisagreeOptions,
        },
      ],
    ];
  });
};