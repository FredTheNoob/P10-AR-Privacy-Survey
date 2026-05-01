type BaseQuestion = {
    id: number;
    title: string;
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

type SurveyData = {
    pages: Question[][]
}

export const SURVEY_DATA: SurveyData = {
    pages: [
        [],
        [
            {
                id: 1,
                title: "How old are you? (at least 18 years old)",
                type: "number"
            },
            {
                id: 2,
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