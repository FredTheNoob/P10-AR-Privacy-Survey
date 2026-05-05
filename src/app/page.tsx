"use client";

import { useEffect, useState } from "react";
import Question from "./_components/question";
import { SURVEY_DATA, type SurveyData, type Question as QuestionType, isQuestion, isQuestionRequired } from "./lib/survey-data";
import { api } from "~/trpc/react";
import Spinner from "./_components/spinner";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
   const { data, isLoading } = api.question.getAll.useQuery();

  const [questions, setQuestions] = useState<SurveyData>({ pages: [] });

  useEffect(() => {
    if (data) setQuestions(data);
  }, [data]);

  const onAnswerChange = (questionIdx: number, answer: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions.pages];
      let question = updatedQuestions[currentPage]![questionIdx];
      if (!question || !isQuestion(question)) return prevQuestions;
      question!.answer = answer;
      return { ...prevQuestions, pages: updatedQuestions };
    });
  };

  const onOptionInputAnswerChange = (questionIdx: number, optionIdx: number, inputText: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions.pages];
      let question = updatedQuestions[currentPage]![questionIdx];
      if (question!.type !== "radio") return prevQuestions;
      let option = question!.options[optionIdx]!;
      if (option.type === "text") {
        option.inputText = inputText;
      }
      return { ...prevQuestions, pages: updatedQuestions };
    });
  }

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
      if (!isQuestion(question)) continue;
      question.error = undefined; // reset previous errors
      if (isQuestionRequired(question) && !question.answer) {
        setQuestionError(question, "This question is required.", errorObj);
        continue;
      }

      switch (question.type) {
        case "number":
          const answerNum = Number(question.answer);
          if (isNaN(answerNum)) {
            setQuestionError(question, "Please enter a valid number.", errorObj);
            continue;
          }
          if (question.min !== undefined && answerNum < question.min) {
            setQuestionError(question, `Value must be at least ${question.min}.`, errorObj);
            continue;
          }
          if (question.max !== undefined && answerNum > question.max) {
            setQuestionError(question, `Value must be at most ${question.max}.`, errorObj);
            continue;
          }
          break;

        case "radio":
          for (const option of question.options) {
            if (option.value === question.answer && option.type === "text") {
              if (!option.inputText) {
                setQuestionError(question, "This option is required.", errorObj);
                break;
              }
            }
          }
          break;
      }
    }
    if (errorObj.hasError) return;

    // Send the answers to the database
    /*
    for (let question of questions.pages[currentPage]!) {
      if (question.type == "info") continue
          const createdResponse = api.response.create({
            answer: question.answer, 
            userId: "ID", //TODO: GET USER ID FROM COOKIES/LOCAL STORAGE / SOMETHING ELSE
            questionId: "ID" //TODO: ADD QUESTION ID TO CLASS IN THE CODE
          })
    }
          */

    // change the page
    setCurrentPage((prevPage) => prevPage + 1);
  }

  if (isLoading) {
    return <Spinner />;
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
            {questions.pages[currentPage]?.map((page, index) => 
              isQuestion(page) ? (
                <Question
                  key={index}
                  index={index}
                  question={page}
                  onChange={onAnswerChange}
                  onOptionInputChange={onOptionInputAnswerChange}
                />
              ) : (
                page.lines.map((line, lineIndex) => <p key={lineIndex}>{line}</p>)
              )
            )}
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
