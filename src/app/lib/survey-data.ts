import { AgreeDisagreeOptions, ScenarioQuestions } from "./common-survey-data";
import * as SurveyTypes from "./survey-types";

export function isQuestion(page: SurveyTypes.Question | SurveyTypes.InformationPage): page is SurveyTypes.Question {
    return (page as SurveyTypes.Question).title !== undefined;
}

export function isQuestionRequired(question: SurveyTypes.Question): boolean {
    return question.required === undefined || question.required === true;
}

export function isQuestionVisible(question: SurveyTypes.Question): boolean {
    return question.visible === undefined || question.visible === true;
}

function randomizeQuestionPairs(questionPages: SurveyTypes.SurveyContent[][]): SurveyTypes.SurveyContent[][] {
    const paired: [SurveyTypes.SurveyContent[], SurveyTypes.SurveyContent[]][] = []; // A 3D array holds our pairs

    // Create the pairs
    for (let i = 0; i + 1 < questionPages.length; i += 2) {
        const first = questionPages[i];
        const second = questionPages[i + 1];
        if (!first || !second) continue; // TS gets angry if we don't check this
        paired.push([first, second]);
    }

    // Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
    for (let i = paired.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = paired[i];
        const b = paired[j];
        if (!a || !b) continue; // TS gets angry if we don't check this
        paired[i] = b;
        paired[j] = a;
    }

    // Flatten the array: 3D -> 2D
    return paired.flat();
}

export const SURVEY_DATA: SurveyTypes.SurveyData = {
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
                        value: "No experience",
                        showNextQuestionOnClick: false
                    },
                    {
                        type: "choose",
                        value: "Tried it once or twice",
                        showNextQuestionOnClick: true
                    },
                    {
                        type: "choose",
                        value: "Occasional use (Rougly once a month or once a week)",
                        showNextQuestionOnClick: true
                    },
                    {
                        type: "choose",
                        value: "Regular use (Several times a week",
                        showNextQuestionOnClick: true
                    },
                    {
                        type: "choose",
                        value: "Frequent / expert use (I use it daily or multiple times per day)",
                        showNextQuestionOnClick: true
                    }
                ]
            },
            {
                visible: false,
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
                options: [
                    {
                        type: "choose",
                        value: "Strongly disagree",
                        showNextQuestionOnClick: false
                    },
                    {
                        type: "choose",
                        value: "Disagree",
                        showNextQuestionOnClick: false
                    },
                    {
                        type: "choose",
                        value: "Neutral",
                        showNextQuestionOnClick: false
                    },
                    {
                        type: "choose",
                        value: "Agree",
                        showNextQuestionOnClick: true
                    },
                    {
                        type: "choose",
                        value: "Strongly agree",
                        showNextQuestionOnClick: true
                    }
                ]
            },
            // TODO: If they answer “agree” or “strongly agree” in previous question, they get this question:
            {
                visible: false,
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
        ...randomizeQuestionPairs(
            [
                ...ScenarioQuestions(
                    "You are at the supermarket looking for cheap fruit",
                    "What is the cheapest fruit?",
                    ["The cheapest fruit is bananas at $0.99 per pound."],
                    ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4lC2PX1ugZuP4EiO0fduFxCQKi4WWCfeiA&s"]
                ),
                ...ScenarioQuestions(
                    "You are going for a walk and stumble upon a pond.",
                    "What type of duck is this?",
                    ["That is a mallard duck"],
                    ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4lC2PX1ugZuP4EiO0fduFxCQKi4WWCfeiA&s"]
                ),
                ...ScenarioQuestions(
                    "You are at a group exercise.",
                    "How do we get started?",
                    ["idk bro"],
                    ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4lC2PX1ugZuP4EiO0fduFxCQKi4WWCfeiA&s"]
                ),
                ...ScenarioQuestions(
                    "You are at a parking lot looking for your car.",
                    "Where is my car? It's a grey chevrolet spark.",
                    ["To the left of the parking lot."],
                    ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4lC2PX1ugZuP4EiO0fduFxCQKi4WWCfeiA&s"]
                ),
                ...ScenarioQuestions(
                    "You are inside your home.",
                    "Does moving my sofa to the left corner of the room look better?",
                    ["Yeah man, that looks better!"],
                    ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4lC2PX1ugZuP4EiO0fduFxCQKi4WWCfeiA&s"]
                ),
                ...ScenarioQuestions(
                    "You are inside your home.",
                    "Where is the TV remote?",
                    ["It's on the coffee table."],
                    ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn4lC2PX1ugZuP4EiO0fduFxCQKi4WWCfeiA&s"]
                ),
            ]
        ),
        [
            {
                title: "I am comfortable with sending a video with other people to a Visual-Language Model (VLM) to get my question answered.",
                ...AgreeDisagreeOptions
            },
            {
                title: "I am comfortable with others sending a video with me to a Visual-Language Model (VLM) to get their question answered.",
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