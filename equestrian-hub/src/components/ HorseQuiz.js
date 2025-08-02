import React, { useState } from 'react'
import { Sparkles, ThumbsUp, ThumbsDown, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const HORSE_QUIZ = [
    {
        question: "True or False: Horses can sleep both lying down and standing up.",
        type: "boolean",
        correct: true,
        explanation: "Horses have a special locking mechanism in their legs that allows them to doze while standing!"
    },
    {
        question: "What is a baby horse called?",
        options: ["Calf", "Foal", "Pony", "Colt"],
        correct: "Foal",
        explanation: "A foal is a horse under one year old, regardless of gender."
    },
    {
        question: "How many gaits do horses naturally have?",
        options: ["2", "3", "4", "5"],
        correct: "4",
        explanation: "Walk, trot, canter, and gallop are the four natural gaits."
    },
    {
        question: "True or False: Horses can see almost 360 degrees around them.",
        type: "boolean",
        correct: true,
        explanation: "Horses have eyes on the sides of their heads, giving them nearly complete vision except for small blind spots directly in front and behind."
    },
    {
        question: "What is the proper term for a horse's hair?",
        options: ["Fur", "Mane", "Coat", "Hide"],
        correct: "Coat",
        explanation: "A horse's hair covering is called a coat, while the mane refers specifically to the hair on the neck."
    }
]

function shuffle(arr) {
    return arr.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}

export default function HorseQuiz() {
    const [questions] = useState(shuffle(HORSE_QUIZ))
    const [current, setCurrent] = useState(0)
    const [userAnswer, setUserAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)

    const currQ = questions[current]

    const handleAnswer = (answer) => {
        setUserAnswer(answer)
        setShowResult(true)
    }

    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(current + 1)
            setUserAnswer(null)
            setShowResult(false)
        } else {
            setCurrent(0)
            setUserAnswer(null)
            setShowResult(false)
        }
    }

    return (
        <div className="relative w-full max-w-screen-xl mx-auto bg-gradient-to-r from-pink-50 to-green-100 border border-pink-300 rounded-2xl shadow-2xl px-3 py-6 sm:p-10 md:p-14 flex flex-col justify-center items-center my-6 min-h-[380px]">
            <span className="absolute left-10 -top-8 z-10">
                <Sparkles size={40} className="text-pink-400 animate-bounce" />
            </span>
            <div className="flex items-center mb-2 sm:mb-5 w-full max-w-2xl">
                <h2 className="font-bold text-xl sm:text-2xl text-green-800 tracking-tight">🐎 Horse Quiz</h2>
                <span className="ml-3 text-xs sm:text-sm bg-pink-200 px-2 py-0.5 rounded-full text-pink-900 font-medium">
                    {current + 1} / {questions.length}
                </span>
            </div>

            <motion.div
                className="mt-2 mb-4 w-full max-w-2xl"
                key={currQ.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <div className="text-base sm:text-lg font-semibold text-primary text-center px-1 mb-2">
                    {currQ.question}
                </div>
            </motion.div>

            <div className="flex flex-col gap-3 w-full max-w-2xl">
                {currQ.type === "boolean" ? (
                    <>
                        <button
                            className={`w-full rounded-lg px-6 py-2 border text-base font-medium shadow-sm transition-all
                ${showResult ?
                                    (currQ.correct === true ? "bg-green-200 border-green-400 text-green-900" : "bg-gray-100 border-gray-300 text-gray-500")
                                    : "bg-white border-gray-300 hover:bg-pink-100 active:scale-95"}`}
                            disabled={showResult}
                            onClick={() => handleAnswer(true)}
                        >
                            True
                        </button>
                        <button
                            className={`w-full rounded-lg px-6 py-2 border text-base font-medium shadow-sm transition-all
                ${showResult ?
                                    (currQ.correct === false ? "bg-green-200 border-green-400 text-green-900" : "bg-gray-100 border-gray-300 text-gray-500")
                                    : "bg-white border-gray-300 hover:bg-pink-100 active:scale-95"}`}
                            disabled={showResult}
                            onClick={() => handleAnswer(false)}
                        >
                            False
                        </button>
                    </>
                ) : currQ.options ? (
                    currQ.options.map((option) => (
                        <button
                            key={option}
                            className={`w-full rounded-lg px-6 py-2 border text-base font-medium shadow-sm transition-all
                ${showResult ? (
                                    option === currQ.correct ?
                                        "bg-green-200 border-green-400 text-green-900"
                                        : (userAnswer === option ? "bg-red-200 border-red-400 text-red-900" : "bg-gray-100 border-gray-300 text-gray-600")
                                ) : "bg-white border-gray-300 hover:bg-pink-100 active:scale-95"}`}
                            disabled={showResult}
                            onClick={() => handleAnswer(option)}
                        >
                            {option}
                        </button>
                    ))
                ) : null}
            </div>

            <AnimatePresence>
                {showResult && (
                    <motion.div
                        className="mt-4 py-3 px-3 md:px-4 rounded-xl flex items-center justify-between max-w-2xl w-full"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        style={{ background: (userAnswer === currQ.correct) ? "#d1fae5" : "#fee2e2" }}
                    >
                        <div className="flex items-center">
                            {(userAnswer === currQ.correct)
                                ? <ThumbsUp size={24} className="text-green-600 mr-2" />
                                : <ThumbsDown size={24} className="text-red-500 mr-2" />
                            }
                            <span className="font-semibold text-base sm:text-lg text-gray-700">
                                {(userAnswer === currQ.correct) ? "Correct!" : "Not quite!"}
                            </span>
                        </div>
                        <div className="ml-5 flex items-center text-green-800 font-medium">
                            <Info size={18} className="mr-1" />
                            <span className="text-xs sm:text-sm">{currQ.explanation}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-center mt-6 max-w-2xl w-full">
                <button
                    className="bg-primary text-white px-6 py-2 rounded-full font-semibold shadow-sm hover:bg-primary-light transition disabled:opacity-50"
                    onClick={handleNext}
                    disabled={!showResult}
                >
                    {current < questions.length - 1 ? "Next Question" : "Play Again"}
                </button>
            </div>
        </div>
    )
}
