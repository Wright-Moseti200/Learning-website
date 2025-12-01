import React, { useState } from 'react';

const QuizPlayer = ({ quiz, onComplete }) => {
  // Default Mock Data if no quiz prop is passed (for preview/testing)
  const defaultQuiz = {
    title: "General Knowledge Check",
    questions: [
      {
        id: 1,
        question: "What is the capital of Kenya?",
        options: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
        answer: "Nairobi"
      },
      {
        id: 2,
        question: "Which language is used for styling web pages?",
        options: ["HTML", "Python", "CSS", "Java"],
        answer: "CSS"
      },
      {
        id: 3,
        question: "What does React use to update the DOM efficiently?",
        options: ["Real DOM", "Shadow DOM", "Virtual DOM", "Browser DOM"],
        answer: "Virtual DOM"
      }
    ]
  };

  const activeQuiz = quiz || defaultQuiz;
  const questions = activeQuiz.questions || [];

  // --- State Management ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false); // To show Correct/Wrong status
  const [isCompleted, setIsCompleted] = useState(false);

  // --- Handlers ---

  const handleOptionClick = (option) => {
    if (showFeedback) return; // Prevent clicking after selection

    setSelectedOption(option);
    setShowFeedback(true);

    if (option === questions[currentIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsCompleted(true);
      if (onComplete) onComplete(score);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCompleted(false);
  };

  // --- Render: Empty State ---
  if (!questions.length) {
    return <div className="p-8 text-center text-stone-500">No quiz questions available.</div>;
  }

  // --- Render: Result Screen ---
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Keep Practicing!";
    if (percentage >= 80) message = "Excellent Work!";
    else if (percentage >= 50) message = "Good Job!";

    return (
      <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-8 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-stone-800 mb-2">{message}</h2>
        <p className="text-stone-600 mb-6">
          You scored <span className="font-bold text-amber-700 text-xl">{score}</span> out of {questions.length}
        </p>

        <div className="w-full bg-stone-100 rounded-full h-4 mb-8 overflow-hidden">
          <div 
            className="bg-amber-600 h-full transition-all duration-1000" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <button 
          onClick={handleRetry}
          className="bg-stone-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-stone-900 hover:shadow-md transition-all"
        >
          Retry Quiz
        </button>
      </div>
    );
  }

  // --- Render: Active Quiz ---
  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden flex flex-col h-full">
      
      {/* Header & Progress */}
      <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-stone-700 uppercase tracking-wide text-xs">
            Quiz Challenge
          </h3>
          <span className="text-xs font-bold text-stone-500">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-amber-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Area */}
      <div className="p-6 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-stone-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Options Grid */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            // Determine styling based on state
            let optionClass = "border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-stone-600";
            
            if (showFeedback) {
              if (option === currentQ.answer) {
                // Correct Answer (Always highlight green at the end)
                optionClass = "border-green-500 bg-green-50 text-green-700 font-bold";
              } else if (option === selectedOption) {
                // Wrong Selection (Highlight red)
                optionClass = "border-red-400 bg-red-50 text-red-700";
              } else {
                // Unselected options (Fade them out)
                optionClass = "border-stone-100 text-stone-300 opacity-50";
              }
            } else if (selectedOption === option) {
              // Selected but waiting (not strictly needed since we show feedback instantly)
              optionClass = "border-amber-600 bg-amber-50 text-amber-700 font-semibold";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group ${optionClass}`}
              >
                <span>{option}</span>
                
                {/* Icons for feedback */}
                {showFeedback && option === currentQ.answer && (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showFeedback && option === selectedOption && option !== currentQ.answer && (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Next Button */}
      {showFeedback && (
        <div className="p-6 bg-stone-50 border-t border-stone-200 animate-fade-in-up">
          <button
            onClick={handleNext}
            className="w-full bg-amber-700 text-white py-3 rounded-lg font-bold hover:bg-amber-800 hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            {currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;