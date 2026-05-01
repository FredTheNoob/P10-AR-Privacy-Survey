type BaseQuestion = {
    title: string;
    answer?: string;
    error?: string;
}

type RadioQuestion = BaseQuestion & {
  type: "radio";
  options: string[];
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
                    "Male",
                    "Female",
                    "Other"
                ]
            }
        ]
    ]
}