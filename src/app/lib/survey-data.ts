import { AgreeDisagreeOptions, ScenarioQuestions } from "./common-survey-data";
import type * as SurveyTypes from "./survey-types";

export function isQuestion(page: SurveyTypes.Question | SurveyTypes.InformationPage): page is SurveyTypes.Question {
    return (page as SurveyTypes.Question).title !== undefined;
}

export function isQuestionRequired(question: SurveyTypes.Question): boolean {
    return question.required === undefined || question.required === true;
}

export function isQuestionVisible(question: SurveyTypes.Question): boolean {
    return question.visible === undefined || question.visible === true;
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
                        value: "Regular use (Several times a week)",
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
                title: "I am aware of how AR systems process and store my data.",
                ...AgreeDisagreeOptions
            },
            {
                title: "Which types of data are you most concerned about sharing?",
                type: "text",
                value: "",
                multiline: true
            },
            {
                title: "I am concerned that personal information may influence the answers the AI gives me.",
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
            {
                visible: false,
                title: "What personal information concerns you the most?",
                type: "text",
                value: "",
                multiline: true
            },
        ],
        [
            {
                type: "info",
                lines: [
                    { type: "text", src: "To study privacy perceptions in realistic scenarios, we recorded a set of first-person videos using wearable smart glasses, specifically the Ray-Ban Meta Wayfare Gen 2 Glasses. The glasses are equipped with an embedded camera that enables hands-free video recording, closely reflecting how AR systems may passively observe and process visual information in real-world use." },
                    { type: "text", src: "The recordings capture everyday situations from the perspective of the wearer, including interactions in both public and private environments." },
                    { type: "text", src: "These recordings are used solely for research purposes. In this survey you will be shown a set of images from these recordings to evaluate privacy implications in a realistic AR context." },
                    { type: "text", src: "One of four privacy-preserving measures will be applied to the images shown. The four privacy-preserving measures are (shown with examples):" },
                    { type: "text", src: "None: Nothing done to the image." },
                    { type: "image", src: "/frames/None/Scenario-1-03-frame_278.jpg" },
                    { type: "text", src: "Black boxes: Draws a black box over the privacy sensitive object, such as a face." },
                    { type: "image", src: "/frames/BlackBoxes/Scenario-1-03-black_box-frame_278.jpg" },
                    { type: "text", src: "Blur: Draws a blurred square over the privacy sensitive object, such as a face." },
                    { type: "image", src: "/frames/Blur/Scenario-1-03-blur-frame_278.jpg" },
                    { type: "text", src: "Generative Censoring: Draws an AI-generated picture over the privacy sensitive object." },
                    { type: "image", src: "/frames/FLUX/flux-Scenario-1-03-frame_278.jpg" },
                ]
            }
        ],
        ...ScenarioQuestions(
            "SUPERMARKET",
            "You are at the supermarket looking for cheap vegetables.",
            "What would the price be for 1.2 kg of sweet potatoes?",
            [
                {
                    image: "/frames/None/Scenario-1-03-frame_278.jpg",
                    aiAnswer: "They're 10 kroner per half kilo. So 1.2 kilos would be 24 kroner.",
                    censoringMethod: "NONE",
                },
                {
                    image: "/frames/Blur/Scenario-1-03-blur-frame_278.jpg",
                    aiAnswer: "24 kroner. The sign says 10 kroner per 0.5 kg, so 1.2 kg costs 24.",
                    censoringMethod: "BLUR",
                },
                {
                    image: "/frames/BlackBoxes/Scenario-1-03-black_box-frame_278.jpg",
                    aiAnswer: "24 kroner. The sign says 10 kroner per half kilo, so 1.2 kg comes to 24.",
                    censoringMethod: "BLACK_BOX",
                },
                {
                    image: "/frames/FLUX/flux-Scenario-1-03-frame_278.jpg",
                    aiAnswer: "24 kroner. They're 10 kroner per half kilo, so 1.2 kilos comes to 24.",
                    censoringMethod: "GEN_CENSORING",
                },
            ],
        ),
        ...ScenarioQuestions(
            "DUCKS",
            "You are going for a walk and stumble upon a pond.",
            "What type of duck is this?",
            [
                {
                    image: "/frames/None/Scenario-2-05-frame_174.jpg",
                    aiAnswer: "That's a mallard duck. The sign shows a female mallard with ducklings, and there's one swimming by the boardwalk.",
                    censoringMethod: "NONE"
                },
                {
                    image: "/frames/Blur/Scenario-2-05-blur-frame_174.jpg",
                    aiAnswer: "That's a mallard. It's a female with ducklings, based on the brown mottled feathers and orange bill on the sign.",
                    censoringMethod: "BLUR"
                },
                {
                    image: "/frames/BlackBoxes/Scenario-2-05-black_box-frame_174.jpg",
                    aiAnswer: "Looks like a female mallard, based on the brown mottled feathers and ducklings on the sign.",
                    censoringMethod: "BLACK_BOX"
                },
                {
                    image: "/frames/FLUX/flux-Scenario-2-05-frame_174.jpg",
                    aiAnswer: "Looks like a mallard. That's the duck on the sign with the brown mottled feathers and ducklings.",
                    censoringMethod: "GEN_CENSORING"
                },
            ],
        ),
        ...ScenarioQuestions(
            "GROUP_EXERCISE",
            "You are at a group exercise.",
            "What points should we consider to get started on this group activity?",
            [
                {
                    image: "/frames/None/Scenario-3-02-frame_137.jpg",
                    aiAnswer: "Start by listing the two risks: launch buggy now and hurt the brand, or delay six weeks and miss commitments. Then decide which hurts customers more. You've got ten minutes, so pick a timekeeper and a note taker to keep it moving.",
                    censoringMethod: "NONE"
                },
                {
                    image: "/frames/Blur/Scenario-3-02-blur-frame_137.jpg",
                    aiAnswer: "Start by outlining the two options: delay 6 weeks to fix issues, or launch on time and risk complaints. Then weigh the costs: brand damage vs revenue loss from delay.",
                    censoringMethod: "BLUR"
                },
                {
                    image: "/frames/BlackBoxes/Scenario-3-02-black_box-frame_137.jpg",
                    aiAnswer: "Start by weighing the trade-offs: delay 6 weeks to fix issues, or launch on time and risk complaints and brand damage. Then pick roles fast, list pros and cons of each option, and decide on your recommendation within 10 minutes.",
                    censoringMethod: "BLACK_BOX"
                },
                {
                    image: "/frames/FLUX/flux-Scenario-3-02-frame_137.jpg",
                    aiAnswer: "Start by listing the two core options: delay launch to fix issues, or launch on time and risk complaints. Then weigh key points: customer impact, brand damage, cost of a 6-week delay, and possible middle ground like a limited release.",
                    censoringMethod: "GEN_CENSORING"
                },
            ],
        ),
        ...ScenarioQuestions(
            "PARKING_LOT",
            "You are at a parking lot looking for your car.",
            "Where is my car? It is a silver/grey Chevrolet Spark",
            [
                {
                    image: "/frames/None/Scenario-4-05-frame_532.jpg",
                    aiAnswer: "I don't see a silver or grey Chevrolet Spark in this view. Try checking the rows to your right or behind you.",
                    censoringMethod: "NONE"
                },
                {
                    image: "/frames/Blur/Scenario-4-05-blur-frame_532.jpg",
                    aiAnswer: "I don't see a silver or grey Chevrolet Spark in this view. The closest silver car on your left is a BMW. Try looking further down the row or in the next section of the lot.",
                    censoringMethod: "BLUR"
                },
                {
                    image: "/frames/BlackBoxes/Scenario-4-05-black_box-frame_532.jpg",
                    aiAnswer: "I don't see a silver Chevrolet Spark in this view. Try panning your head slowly left or right so I can scan more of the lot.",
                    censoringMethod: "BLACK_BOX"
                },
                {
                    image: "/frames/FLUX/flux-Scenario-4-05-frame_532.jpg",
                    aiAnswer: "I don't see your silver Chevrolet Spark in this view. Try looking further down the row or checking the next aisle.",
                    censoringMethod: "GEN_CENSORING"
                },
            ],
        ),
        ...ScenarioQuestions(
            "AT_HOME_COUCH",
            "You are inside your home.",
            "Would my room look better if I moved my sofa to the left corner?",
            [
                {
                    image: "/frames/None/Scenario-5-01-frame_1103.jpg",
                    aiAnswer: "Yes, moving it to the left corner by the guitar would open up the space and balance the room better. It'd make the doorway feel less blocked.",
                    censoringMethod: "NONE"
                },
                {
                    image: "/frames/Blur/Scenario-5-01-blur-frame_1103.jpg",
                    aiAnswer: "Yes, moving the sofa to that left corner would open up the room. It creates more floor space and gives you a clearer walkway from the door.",
                    censoringMethod: "BLUR"
                },
                {
                    image: "/frames/BlackBoxes/Scenario-5-01-black_box-frame_1103.jpg",
                    aiAnswer: "Yes, moving the sofa to the left corner would open up the space and balance the room better with the chair. It'll feel less crowded on the right side.",
                    censoringMethod: "BLACK_BOX"
                },
                {
                    image: "/frames/FLUX/flux-Scenario-5-01-frame_1103.jpg",
                    aiAnswer: "Yes, moving the sofa to that left corner would open up the room. It'll face away from the doorway and make the space feel bigger.",
                    censoringMethod: "GEN_CENSORING"
                },
            ],
        ),
        ...ScenarioQuestions(
            "AT_HOME_TV_REMOTE",
            "You are inside your home.",
            "Where is the TV remote?",
            [
                {
                    image: "/frames/None/Scenario-6-03-frame_51.jpg",
                    aiAnswer: "It's on the bed, bottom right, by your leg.",
                    censoringMethod: "NONE"
                },
                {
                    image: "/frames/Blur/Scenario-6-03-blur-frame_51.jpg",
                    aiAnswer: "It's on the bed to your right, next to your leg.",
                    censoringMethod: "BLUR"
                },
                {
                    image: "/frames/BlackBoxes/Scenario-6-03-black_box-frame_51.jpg",
                    aiAnswer: "It's on your right, at the edge of the bed.",
                    censoringMethod: "BLACK_BOX"
                },
                {
                    image: "/frames/FLUX/flux-Scenario-6-03-frame_51.jpg",
                    aiAnswer: "It's on the bed to your right, near the edge.",
                    censoringMethod: "GEN_CENSORING"
                },
            ],
        ),
        [
            {
                title: "I am comfortable with sending a video/image with other people to an AI to get my question answered.",
                ...AgreeDisagreeOptions
            },
            {
                title: "I am comfortable with others sending a video/image with me to an AI to get their question answered.",
                ...AgreeDisagreeOptions
            },
            // {
            //     required: false,
            //     title: "Which censoring methods are most effective at protecting user privacy? Rank them.",
            //     type: "rank",
            //     options: [
            //         "None",
            //         "Generative Censoring",
            //         "Blur",
            //         "Black box"
            //     ],
            //     answer: "None,Generative Censoring,Blur,Black box"
            // },
            // {
            //     title: "Why did you pick this ranking?",
            //     type: "text",
            //     value: "",
            //     multiline: true
            // },
            {
                title: "Does your willingness to share videos/images with an AI depend on your relationship with the people in the video/image?",
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
                title: "What privacy sensitive information do you want to remove from a video/image?",
                type: "text",
                value: "",
                multiline: true
            },
            {
                required: false,
                title: "Any further comments?",
                type: "text",
                value: "",
                multiline: true
            },
        ]
    ]
}