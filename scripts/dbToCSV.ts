import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const targetFile = path.resolve(__dirname, "../survey-questions.csv");
const prisma = new PrismaClient();

const csvEscape = (value: string | null | undefined) => {
    const str = value ?? "";
    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

async function main() {
    if (fs.existsSync(targetFile)) {
        console.error("survey-questions.csv already exists. Please delete it before running this script.");
        process.exit(1);
    }

    console.log("Writing CSV header...");
    // Add all of the row headers to the CSV file
    const userIds = await prisma.user.findMany({
        select: {
            prolificId: true
        },
        orderBy: {
            prolificId: "asc"
        }
    });

    const headers = [
        "question",
        "censoringMethod",
        "scenario",
        ...userIds.map((u) => `user_${u.prolificId}`),
    ];

    fs.writeFileSync(targetFile, headers.join(",") + "\n");

    console.log("CSV header written.");

    const surveyQuestions = await prisma.surveyQuestion.findMany({
        orderBy: [
            { pageIndex: "asc" },
            { questionIndex: "asc" },
        ],
        include: {
            responses: {
                orderBy: {
                    userId: "asc",
                },
                select: {
                    userId: true,
                    answer: true,
                    questionId: true,
                },
            },
        },
    });

    console.log(`Writing ${surveyQuestions.length} survey question answers to CSV...`);

    let i = 1;
    for (const question of surveyQuestions) {
        if (question.type === "info") continue;

        const row = [
            csvEscape(question.title),
            csvEscape(question.censoringMethod ?? "null"),
            csvEscape(question.scenario ?? "null"),
        ];

        for (const user of userIds) {
            const userResponse = question.responses.find((r) => r.userId === user.prolificId && r.questionId === question.id);

            if (!userResponse) {
                row.push(csvEscape("null"));
            } else {
                row.push(csvEscape(userResponse.answer ?? "null"));
            }
        }

        fs.appendFileSync(targetFile, row.join(",") + "\n");
        console.log(`${i}/${surveyQuestions.length} questions written to CSV...`);
        i++;
    }
    console.log(`${surveyQuestions.length}/${surveyQuestions.length} questions written to CSV...`);
}

main()
    .then(() => {
        console.log("Conversion complete");
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });