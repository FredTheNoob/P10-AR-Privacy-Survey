import type { Question as QuestionType } from "../lib/survey-data";

interface QuestionProps {
    index: number;
    question: QuestionType;
    onChange: (questionId: number, answer: string) => void;
    onOptionInputChange: (questionId: number, optionId: number, inputText: string) => void;
}

const inputStyles = "border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function Question({ index, question, onChange, onOptionInputChange }: QuestionProps) {
    return (
        <div className="space-y-2">
            {question.image && <img src={question.image} alt="Question related" className="max-w-full h-auto rounded-md" />}
            <p>{question.title}</p>
            {(question.type === "number" || question.type === "text") && (
                <input
                    value={question.answer ?? ""}
                    className={inputStyles}
                    onChange={(e) => onChange(index, e.target.value)}
                />
            )}
            {question.type === "radio" && (
                <div className="flex flex-col gap-2">
                    {question.options.map((option, optionIndex) => (
                        <div key={option.value}>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={question.title}
                                    value={option.value}
                                    checked={question.answer === option.value}
                                    onChange={() => onChange(index, option.value)}
                                />
                                {option.value}
                            </label>
                            {option.type === "text" && question.answer === option.value && (
                                <input
                                    type="text"
                                    value={option.inputText ?? ""}
                                    className={inputStyles}
                                    onChange={(e) => onOptionInputChange(index, optionIndex, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
            {question.error && <p className="text-red-500">{question.error}</p>}
        </div>
    );
}