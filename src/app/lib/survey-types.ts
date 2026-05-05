export type BaseQuestion = {
    id?: string
    title: string;
    visible?: boolean;
    required?: boolean;
    answer?: string;
    error?: string;
}

export type ChooseRadioOption = {
    type: "choose";
    value: string;
    showNextQuestionOnClick?: boolean;
}

export type TextRadioOption = {
    type: "text";
    value: string;
    inputText?: string;
}

export type RadioQuestion = BaseQuestion & {
    type: "radio";
    options: (ChooseRadioOption | TextRadioOption)[];
};

export type NumberQuestion = BaseQuestion & {
    type: "number";
    min?: number;
    max?: number;
};

export type TextQuestion = BaseQuestion & {
    type: "text";
    value: string;
};

export type InformationPage = {
    id?: string
    type: "info";
    lines: string[];
    image?: string;
}

export type Question = RadioQuestion | NumberQuestion | TextQuestion;
export type SurveyContent = Question | InformationPage;

export type SurveyData = {
    pages: SurveyContent[][];
}