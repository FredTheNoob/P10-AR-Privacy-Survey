import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const targetFile = path.resolve(__dirname, "../survey-questions.csv");
const prisma = new PrismaClient();

const formatCEST = (date: Date | null | undefined) => {
    if (!date) return "null";
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Copenhagen",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
    }).format(date);
};

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
    const headers = [
        "prolificId",
        "time",
        "trial#",
        "scenario",
        "censoringMethod",
        "question",
        "answer",
    ];

    fs.writeFileSync(targetFile, headers.join(",") + "\n", {encoding: "utf-8"});

    console.log("CSV header written.");

    const userAnswers = await prisma.user.findMany({
        include: {
            responses: {
                orderBy: [
                    {
                        question: {
                            pageIndex: "asc",
                        },
                    },
                    {
                        question: {
                            questionIndex: "asc",
                        },
                    },
                ],
                select: {
                    userId: true,
                    answer: true,
                    questionId: true,
                    answeredAt: true,
                    question: {
                        select: {
                            pageIndex: true,
                            questionIndex: true,
                            title: true,
                            censoringMethod: true,
                            scenario: true,
                        },
                    },
                },
            },
        },
    });

    console.log(`Writing ${userAnswers.length} survey question answers to CSV...`);

    for (const userAnswer of userAnswers) {
        let i = 1;
        for (const response of userAnswer.responses) {
            const row = [
                csvEscape(response.userId),
                csvEscape(formatCEST(response.answeredAt)),
                csvEscape(i.toString()),
                csvEscape(response.question.scenario ?? "null"),
                csvEscape(response.question.censoringMethod ?? "null"),
                csvEscape(response.question.title),
                csvEscape(response.answer),
            ];

            fs.appendFileSync(targetFile, row.join(",") + "\n", {encoding: "utf-8"});
            console.log(`${i}/${userAnswer.responses.length} questions written to CSV...`);
            i++;
        }
            
    }
    console.log(`${userAnswers.length}/${userAnswers.length} questions written to CSV...`);
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