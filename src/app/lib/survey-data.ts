type BaseQuestion = {
    visible: boolean;
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
                visible: true,
                title: "How old are you? (at least 18 years old)",
                type: "number",
                min: 18,
                max: 120
            },
            {
                visible: true,
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
            },
            {
                visible: true,
                title: "Do you have experience with Augmented Reality (AR)?",
                type: "radio",
                options: [
                    {
                        type: "choose",
                        value: "No experience"
                    },
                    {
                        type: "choose",
                        value: "Tried it once or twice"
                    },
                    {
                        type: "choose",
                        value: "Occasional use (Rougly once a month or once a week)"
                    },
                    {
                        type: "choose",
                        value: "Regular use (Several times a week"
                    },
                    {
                        type: "choose",
                        value: "Frequent / expert use (I use it daily or multiple times per day)"
                    }
                ]
            }
        ]
    ]
}