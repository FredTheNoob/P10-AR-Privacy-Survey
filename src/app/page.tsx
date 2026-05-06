"use client";

import { useEffect, useState } from "react";
import Question from "./_components/question";
import { isQuestion, isQuestionRequired, isQuestionVisible, SURVEY_DATA } from "./lib/survey-data";
import { api } from "~/trpc/react";
import Spinner from "./_components/spinner";
import type { Question as QuestionType, SurveyData } from "./lib/survey-types";
import ConsentDialog from "./_components/consent-dialog";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { data, } = api.question.getAll.useQuery();
  const [hasConsent, setHasConsent] = useState(false);
  const [surveyComplete, setSurveyComplete] = useState(false);

  // const [questions, setQuestions] = useState<SurveyData>({ pages: [] });
  const [questions, setQuestions] = useState<SurveyData>(SURVEY_DATA);
  const createResponse = api.response.create.useMutation();

  const totalPages = questions.pages.length - 1;
  const progress = totalPages > 0 ? Math.min(100, (currentPage / totalPages) * 100) : 0;

  // useEffect(() => {
  //   if (data) setQuestions(data);
  // }, [data]);

  useEffect(() => {
    setCurrentPage(Number(localStorage.getItem("currentPage") ?? "0"));
    setHasConsent(localStorage.getItem("hasConsent") === "true");
    setSurveyComplete(localStorage.getItem("surveyComplete") === "true");

    const stored = localStorage.getItem("surveyAnswers");
    if (stored) setQuestions(JSON.parse(stored) as SurveyData);
    setIsLoading(false);
  }, []);

  const onAnswerChange = (questionIdx: number, answer: string, optionIdx?: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions.pages];
      const question = updatedQuestions[currentPage]![questionIdx];
      if (!question || !isQuestion(question)) return prevQuestions;
      question.answer = answer;

      if (question.type === "radio" && optionIdx !== undefined) {
        const option = question.options[optionIdx]!;
        if (option.type === "choose" && option.showNextQuestionOnClick !== undefined) {
          const nextQuestion = updatedQuestions[currentPage]![questionIdx + 1];
          if (nextQuestion && isQuestion(nextQuestion)) {
            nextQuestion.visible = option.showNextQuestionOnClick;
          }
        }
      }

      return { ...prevQuestions, pages: updatedQuestions };
    });
  };

  const onOptionInputAnswerChange = (questionIdx: number, optionIdx: number, inputText: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions.pages];
      const question = updatedQuestions[currentPage]![questionIdx];
      if (question!.type !== "radio") return prevQuestions;
      const option = question!.options[optionIdx]!;
      if (option.type === "text") {
        option.inputText = inputText;
      }
      return { ...prevQuestions, pages: updatedQuestions };
    });
  }

  const onRankReorder = (questionIdx: number, nextOptions: string[]) => {
    setQuestions((prevQuestions) => {
      const updatedPages = [...prevQuestions.pages];
      const current = updatedPages[currentPage];
      if (!current) return prevQuestions;

      const updatedPage = [...current];
      const question = updatedPage[questionIdx];

      if (!question || question.type !== "rank") return prevQuestions;

      updatedPage[questionIdx] = { ...question, options: nextOptions };
      updatedPages[currentPage] = updatedPage;

      return { ...prevQuestions, pages: updatedPages };
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

  async function goToNextPage() {
    // validate answers
    const errorObj = { hasError: false };
    for (const question of questions.pages[currentPage]!) {
      if (!isQuestion(question)) continue;
      if (!isQuestionVisible(question)) continue;
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

    localStorage.setItem("surveyAnswers", JSON.stringify(questions));
    localStorage.setItem("currentPage", (currentPage + 1).toString());

    if (currentPage === questions.pages.length - 1) {
      localStorage.setItem("surveyComplete", "true");

      // Send the answers to the database
      const userId = localStorage.getItem("user")
      if (!userId) {
        throw Error("User ID is null. Cannot save answers from user")
      }

      const storedAnswers = JSON.parse(
        localStorage.getItem("surveyAnswers") ?? "{}"
      ) as SurveyData;

      for (const pages of storedAnswers.pages) {
        for (const question of pages) {
          if (question.type === "info") continue;

          const answer = question.answer;

          if (!question.id || answer === undefined) continue;
          await createResponse.mutateAsync({
            answer: answer,
            userId: userId,
            questionId: question.id,
          });
        }
      }

      window.location.href = "/done";
      return;
    }

    // change the page
    setCurrentPage((prevPage) => prevPage + 1);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (surveyComplete) {
    window.location.href = "/done";
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {!hasConsent && <ConsentDialog />}


      <div className="container mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6">
        {currentPage === 0 && (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              Privacy in AR
            </h1>
            <div className="space-y-5">
              <p>
                Augmented Reality (AR) systems often rely on real-time environmental sensing, including camera input and spatial mapping, while Artificial Intelligense (AI) can process and combine visual and textual data to generate outputs. Both technologies may involve the collection, processing, and storage of sensitive or personal information, sometimes in ways that are not fully transparent to users.
                This survey aims to explore how users perceive privacy in the context of AR and AI. We are interested in understanding your level of awareness, concerns, expectations, and trust regarding how these technologies handle personal data.
              </p>
              <p>
                If you are unaware of what AR systems can be used for, here is a video showcasing possible AR usage:
              </p>
              <video
                src="/intro-videos/1.mp4"
                controls
                className="w-full sm:max-w-2xl aspect-video rounded-md"
              />
              <p>
                Here is another video showcasing possible AI usage:
              </p>
              <video
                src="/intro-videos/2.mp4"
                controls
                className="w-full sm:max-w-2xl aspect-video rounded-md"
              />

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
            <div className="w-full px-4 pt-4">
              <div className="h-2 w-full rounded bg-gray-100">
                <div
                  className="h-2 rounded bg-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                />
              </div>
            </div>
            {questions.pages[currentPage]?.map((page, index) =>
              isQuestion(page) ? (
                isQuestionVisible(page) && (
                  <Question
                    key={index}
                    index={index}
                    question={page}
                    onChange={onAnswerChange}
                    onOptionInputChange={onOptionInputAnswerChange}
                    onRankReorder={onRankReorder}
                  />
                )
              ) : (
                <div key={index} className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
                  {page.image && <img
                    src={page.image}
                    alt="Page image"
                    className="w-full sm:max-w-2xl lg:max-w-4xl max-h-[60vh] object-contain"
                  />}
                  {page.lines.map((line, lineIndex) => <p key={lineIndex}>{line}</p>)}
                  {page.footer && <p className="text-sm text-gray-500">{page.footer}</p>}
                </div>
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
                {currentPage === questions.pages.length - 1 ? "Finish Survey" : "Next Page"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
