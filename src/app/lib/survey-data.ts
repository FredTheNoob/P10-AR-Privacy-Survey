type BaseQuestion = {
    title: string;
    answer?: string;
    error?: string;
}

type ChooseRadioOption = {
    type: "choose";
    value: string;
}

type TextRadioOption = {
    type: "text";
    value: string;
    inputText?: string;
}

type RadioQuestion = BaseQuestion & {
  type: "radio";
  options: (ChooseRadioOption | TextRadioOption)[];
};

type NumberQuestion = BaseQuestion & {
  type: "number";
  min?: number;
  max?: number;
};

export type Question = RadioQuestion | NumberQuestion;

export type SurveyData = {
    pages: Question[][]
}

export const SURVEY_DATA: SurveyData = {
    pages: [
        [],
        [
            {
                title: "How old are you? (at least 18 years old)",
                type: "number",
                min: 18,
                max: 120
            },
            {
                title: "What is your gender?",
                type: "radio",
                options: [
                    {
                        type: "choose",
                        value: "Male"
                    },
                    {
                        type: "choose",
                        value: "Female"
                    },
                    {
                        type: "text",
                        value: "Other"
                    }
                ]
            }
        ]
    ]
}