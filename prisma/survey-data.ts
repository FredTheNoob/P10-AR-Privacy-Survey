type BaseQuestion = {
    title: string;
    image?: string;
    required?: boolean;
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

type TextQuestion = BaseQuestion & {
    type: "text";
    value: string;
};

export type InformationPage = {
    type: "info";
    lines: string[];
}


export type Question = RadioQuestion | NumberQuestion | TextQuestion;

export function isQuestion(page: Question | InformationPage): page is Question {
    return (page as Question).title !== undefined;
}

export function isQuestionRequired(question: Question): boolean {
    return question.required === undefined || question.required === true;
}

export type SurveyData = {
    pages: (Question[] | InformationPage[])[];
}

const AgreeDisagreeOptions: { options: ChooseRadioOption[] } = {
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
            },
            {
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
            },
            // TODO: If participants answer anything but “no experience” in previous question, they get this question:
            {
                title: "Have you used any AI in your usage of AR?",
                type: "radio",
                options: [
                    {
                        type: "choose",
                        value: "Yes"
                    },
                    {
                        type: "choose",
                        value: "No"
                    }
                ]
            },
            {
                title: "I am aware of how this AR system processes and stores my data.",
                type: "radio",
                ...AgreeDisagreeOptions
            },
            {
                title: "Which types of data are you most concerned about sharing?",
                type: "text",
                value: "For instance sharing your face, private living space, etc.",
            },
            {
                title: "I am concerned that personal information may influence the answers the Visual-Language Model (VLM) gives me.",
                type: "radio",
                ...AgreeDisagreeOptions
            },
            // TODO: If they answer “agree” or “strongly agree” in previous question, they get this question:
            {
                title: "What personal information concerns you the most?",
                type: "text",
                value: "Gender, ethnic, age, etc.",
            },
        ],
        [
            {
                type: "info",
                lines: [
                    "To study privacy perceptions in realistic scenarios, we recorded a set of first-person videos using wearable smart glasses, specifically the Ray-Ban Meta Wayfare Gen 2 Glasses. The glasses are equipped with an embedded camera that enables hands-free video recording, closely reflecting how AR systems may passively observe and process visual information in real-world use.",
                    "The recordings capture everyday situations from the perspective of the wearer, including interactions in both public and private environments. The scenarios were designed to represent common use cases of AR systems, such as question answering, object removal, etc.",
                    "These recordings are used solely for research purposes. In this survey the participants will be shown a set of images from these recordings that allows participants to evaluate privacy implications in a realistic AR context."
                ]
            }
        ],
        // TODO: Add questions for all images when doing the randomization task
        [
            {
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4lC2PX1ugZuP4EiO0fduFxCQKi4WWCfeiA&s",
                title: "I am comfortable with this image being processed by a Visual-Language Model (VLM).",
                type: "radio",
                ...AgreeDisagreeOptions
            }
        ], 
        [
            {
                title: "I am comfortable with sending a video with other people to a Visual-Language Model (VLM) to get my question answered.",
                type: "radio",
                ...AgreeDisagreeOptions
            },
            {
                title: "I am comfortable with others sending a video with me to a Visual-Language Model (VLM) to get their question answered.",
                type: "radio",
                ...AgreeDisagreeOptions
            },
            {
                title: "Which privacy-preserving techniques are most effective at protecting user privacy? Rank them.",
                type: "radio",
                options: [
                    {
                        type: "choose",
                        value: "None"
                    },
                    {
                        type: "choose",
                        value: "Morphing / replacing"
                    },
                    {
                        type: "choose",
                        value: "Blur"
                    },
                    {
                        type: "choose",
                        value: "Black box"
                    },
                ]
            },
            {
                title: "Does your willingness to share videos with a Vision-Language Model (VLM) depend on your relationship with the people in the video?",
                type: "radio",
                options: [
                    {
                        type: "choose",
                        value: "Not at all"
                    },
                    {
                        type: "choose",
                        value: "Slightly"
                    },
                    {
                        type: "choose",
                        value: "Moderately"
                    },
                    {
                        type: "choose",
                        value: "Strongly"
                    },
                    {
                        type: "choose",
                        value: "Very strongly"
                    },
                ]
            },
            {
                required: false,
                title: "Any further comments?",
                type: "text",
                value: "",
            },
        ]
    ]
}