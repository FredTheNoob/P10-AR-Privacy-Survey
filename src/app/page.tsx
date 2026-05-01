"use client";

import Link from "next/link";
import { useState } from "react";
import Question from "./_components/question";
import { SURVEY_DATA, type SurveyData, type Question as QuestionType } from "./lib/survey-data";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const [questions, setQuestions] = useState<SurveyData>(SURVEY_DATA);

  const onAnswerChange = (questionIdx: number, answer: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions.pages];
      let question = updatedQuestions[currentPage]![questionIdx];
      question!.answer = answer;
      return { ...prevQuestions, pages: updatedQuestions };
    });
  };

  function setQuestionError(question: QuestionType, error: string, errorObj: { hasError: boolean }) {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions.pages];
      question.error = error;
      return { ...prevQuestions, pages: updatedQuestions };
    });
    errorObj.hasError = true;
  }

  function goToPreviousPage() {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  }

  function goToNextPage() {
    // validate answers
    let errorObj = { hasError: false };
    for (let question of questions.pages[currentPage]!) {
      question.error = undefined; // reset previous errors
      if (!question.answer) {
        setQuestionError(question, "This question is required.", errorObj);
        continue;
      }

      switch (question.type) {
        case "number":
          if (isNaN(Number(question.answer))) {
            setQuestionError(question, "Please enter a valid number.", errorObj);
            continue;
          }
          if (question.min !== undefined && Number(question.answer) < question.min) {
            setQuestionError(question, `Value must be at least ${question.min}.`, errorObj);
            continue;
          }
          if (question.max !== undefined && Number(question.answer) > question.max) {
            setQuestionError(question, `Value must be at most ${question.max}.`, errorObj);
            continue;
          }
          break;
      }
    }
    if (errorObj.hasError) return;

    // change the page
    setCurrentPage((prevPage) => prevPage + 1);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {currentPage === 0 && (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Privacy in AR
            </h1>
            <div className="space-y-5">
              <p>
                Augmented Reality (AR) systems often rely on real-time environmental sensing, including camera input and spatial mapping, while Vision-Language Models (VLMs) process and combine visual and textual data to generate outputs. Both technologies may involve the collection, processing, and storage of sensitive or personal information, sometimes in ways that are not fully transparent to users.
                This survey aims to explore how users perceive privacy in the context of AR and VLMs. We are interested in understanding your level of awareness, concerns, expectations, and trust regarding how these technologies handle personal data.
              </p>
              <p>
                If you are unaware of what AR systems can be used for, here is a video showcasing possible AR usage:
              </p>
              <p>
                https://www.youtube.com/watch?v=TCU-HCQJrQE
              </p>
              <p>
                Here is another video showcasing possible VLM usage:
              </p>
              https://youtu.be/oBZ8toFKZls?si=QQQF30qlVHWAJEeO&t=167

              <p>
                Please watch until the 3:04 mark
              </p>

              <p>
                This survey takes approximately X minutes to complete.
              </p>
            </div>
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-10 py-3 font-semibold transition hover:bg-blue-600 text-white"
              onClick={goToNextPage}
            >
              Next Page
            </button>
          </>
        )}
        {currentPage > 0 && (
          <>
            {SURVEY_DATA.pages[currentPage]?.map((question, index) =>
              <Question
                key={index}
                index={index}
                question={question}
                onChange={onAnswerChange}
              />)
            }
            <div className="flex space-x-3">
              <button
                type="submit"
                className="rounded-full bg-white px-10 py-3 font-semibold border border-gray-300 text-gray-700"
                onClick={goToPreviousPage}
              >
                Previous Page
              </button>
              <button
                type="submit"
                className="rounded-full bg-blue-500 px-10 py-3 font-semibold transition hover:bg-blue-600 text-white"
                onClick={goToNextPage}
              >
                Next Page
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
