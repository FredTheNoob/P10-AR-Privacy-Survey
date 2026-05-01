import { useState } from "react";
import type { Question as QuestionType } from "../lib/survey-data";

interface QuestionProps {
    question: QuestionType;
    onChange: (questionId: number, answer: string) => void;
}

export default function Question({ question, onChange }: QuestionProps) {
    return (
        <div className="space-y-2">
            <p>{question.title}</p>
            {question.type === "number" && (
                <input
                    className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => onChange(question.id, e.target.value)}
                />
            )}
            {question.type === "radio" && (
                <div className="flex flex-col gap-2">
                    {question.options.map((option) => (
                        <label key={option} className="flex items-center gap-2">
                            <input type="radio" name={question.title} value={option} onChange={() => onChange(question.id, option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}