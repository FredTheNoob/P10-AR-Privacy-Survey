import type { Question as QuestionType } from "../lib/survey-types";

interface QuestionProps {
    index: number;
    question: QuestionType;
    onChange: (questionId: number, answer: string, optionId?: number) => void;
    onOptionInputChange: (questionId: number, optionId: number, inputText: string) => void;
    onRankReorder: (questionId: number, nextOptions: string[]) => void;
}

const inputStyles = "border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500";

const swapOptions = (options: string[], from: number, to: number) => {
    const next = [...options];
    const a = next[from];
    const b = next[to];
    if (!a || !b) return null;
    next[from] = b;
    next[to] = a;
    return next;
};

export default function Question({ index, question, onChange, onOptionInputChange, onRankReorder }: QuestionProps) {
    return (
        <div className="space-y-2">
            <p>{question.title}</p>
            {question.type === "number" && (
                <input
                    value={question.answer ?? ""}
                    placeholder="Enter a number"
                    className={inputStyles}
                    onChange={(e) => onChange(index, e.target.value)}
                />
            )}

            {question.type === "text" && question.multiline && (
                <textarea
                    value={question.answer ?? ""}
                    placeholder={question.value}
                    className={inputStyles}
                    rows={4}
                    onChange={(e) => onChange(index, e.target.value)}
                />
            )}

            {question.type === "text" && !question.multiline && (
                <input
                    value={question.answer ?? ""}
                    placeholder={question.value}
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
                                    onChange={() => onChange(index, option.value, optionIndex)}
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
            {question.type === "rank" && (
                <div className="flex flex-col gap-2">
                    {question.options.map((option, optionIndex) => (
                        <div key={option} className="flex items-center gap-3">
                            <span className="w-6 text-right text-sm text-gray-500">{optionIndex + 1}.</span>
                            <span className="flex-1">{option}</span>
                            <button
                                type="button"
                                className="rounded border px-2 py-1 text-sm disabled:opacity-40"
                                disabled={optionIndex === 0}
                                onClick={() => {
                                    const next = swapOptions(question.options, optionIndex, optionIndex - 1);
                                    if (next) onRankReorder(index, next);
                                }}
                            >
                                ↑
                            </button>
                            <button
                                type="button"
                                className="rounded border px-2 py-1 text-sm disabled:opacity-40"
                                disabled={optionIndex === question.options.length - 1}
                                onClick={() => {
                                    const next = swapOptions(question.options, optionIndex, optionIndex + 1);
                                    if (next) onRankReorder(index, next);
                                }}
                            >
                                ↓
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {question.error && <p className="text-red-500">{question.error}</p>}
        </div>
    );
}