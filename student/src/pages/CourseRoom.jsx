import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/ContextProvider';

// --- CUSTOM ICON COMPONENTS (No External Libraries) ---
const Icons = {
  Play: ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  PlayCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  FileText: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  ChevronLeft: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Menu: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

// --- INTERNAL COMPONENT: VideoPlayer ---
const VideoPlayer = ({ videoUrl, title, onComplete }) => {
  const renderPlayer = () => {
    if (!videoUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500">
          <div className="p-4 rounded-full bg-stone-800 mb-2">
            <Icons.Play className="w-8 h-8 opacity-50" />
          </div>
          <p className="text-sm font-medium">Select a lesson to start watching</p>
        </div>
      );
    }

    // 1. Handle Direct Files (.mp4, .webm)
    if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')) {
      return (
        <video
          controls
          className="w-full h-full object-contain bg-black"
          onEnded={onComplete}
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    // 2. Handle YouTube
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
      <iframe
        src={embedUrl}
        title={title || "Video player"}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  };

  return (
    <div className="bg-white p-1 rounded-xl border border-stone-200 shadow-lg">
      <div className="relative w-full pt-[56.25%] bg-stone-900 rounded-lg overflow-hidden shadow-inner">
        <div className="absolute top-0 left-0 w-full h-full">
          {renderPlayer()}
        </div>
      </div>
    </div>
  );
};

// --- INTERNAL COMPONENT: QuizPlayer ---
const QuizPlayer = ({ quiz, onComplete }) => {
  const defaultQuiz = {
    title: "Knowledge Check",
    questions: [
      { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"], answer: "Hyper Text Markup Language" },
      { id: 2, question: "Which tag is used for the largest heading?", options: ["<h6>", "<head>", "<h1>", "<heading>"], answer: "<h1>" },
      { id: 3, question: "What is the correct HTML element for inserting a line break?", options: ["<lb>", "<break>", "<br>", "<b>"], answer: "<br>" }
    ]
  };

  const activeQuiz = quiz || defaultQuiz;
  const questions = activeQuiz.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleOptionClick = (option) => {
    if (showFeedback) return;
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
      if (onComplete) onComplete();
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-8 text-center h-full flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Icons.CheckCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">Quiz Completed!</h2>
        <p className="text-stone-600 mb-6">You scored <span className="font-bold text-amber-700">{score}</span> / {questions.length}</p>
        <button onClick={handleRetry} className="bg-stone-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-stone-900 transition-all">Retry Quiz</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden flex flex-col h-full">
      <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-stone-700 uppercase tracking-wide text-xs">Quiz Challenge</h3>
          <span className="text-xs font-bold text-stone-500">{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-600 h-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col overflow-y-auto">
        <h2 className="text-lg font-bold text-stone-800 mb-6">{currentQ.question}</h2>
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let optionClass = "border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-stone-600";
            if (showFeedback) {
              if (option === currentQ.answer) optionClass = "border-green-500 bg-green-50 text-green-700 font-bold";
              else if (option === selectedOption) optionClass = "border-red-400 bg-red-50 text-red-700";
              else optionClass = "border-stone-100 text-stone-300 opacity-50";
            }
            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${optionClass}`}
              >
                <span>{option}</span>
                {showFeedback && option === currentQ.answer && <Icons.CheckCircle className="w-5 h-5 text-green-600" />}
              </button>
            );
          })}
        </div>
      </div>
      {showFeedback && (
        <div className="p-6 bg-stone-50 border-t border-stone-200">
          <button onClick={handleNext} className="w-full bg-amber-700 text-white py-3 rounded-lg font-bold hover:bg-amber-800 transition-all flex items-center justify-center gap-2">
            {currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'}
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT: CourseRoom ---
const CourseRoom = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { activeCourse, fetchCourse, markLessonComplete, loading } = useStudent();

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const courseData = activeCourse;

  const allLessons = useMemo(() => {
    if (!courseData || !courseData.modules) return [];
    return courseData.modules.flatMap(m => m.lessons);
  }, [courseData]);

  const [activeLessonId, setActiveLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Set initial active lesson when lessons are loaded
  useEffect(() => {
    if (allLessons.length > 0 && !activeLessonId) {
      setActiveLessonId(allLessons[0].id || allLessons[0]._id);
    }
  }, [allLessons, activeLessonId]);

  const activeLesson = allLessons.find(l => (l.id || l._id) === activeLessonId) || allLessons[0];
  const activeIndex = allLessons.findIndex(l => (l.id || l._id) === activeLessonId);

  const handleLessonChange = (lessonId) => {
    setActiveLessonId(lessonId);
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    if (activeIndex < allLessons.length - 1) {
      const nextLesson = allLessons[activeIndex + 1];
      handleLessonChange(nextLesson.id || nextLesson._id);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevLesson = allLessons[activeIndex - 1];
      handleLessonChange(prevLesson.id || prevLesson._id);
    }
  };

  const handleLessonComplete = async () => {
    if (activeLesson) {
      await markLessonComplete(courseId, activeLesson.id || activeLesson._id);
      console.log(`Lesson ${activeLesson.title} marked as complete`);
      handleNext();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading course content...</div>;
  if (!courseData) return <div className="p-10 text-center">Course not found</div>;
  if (!activeLesson) return <div className="p-10 text-center">No lessons available for this course yet.</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-stone-50">

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : ''}`}>
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

          <div className="mb-2">
            <button onClick={() => navigate('/')} className="text-sm text-stone-500 hover:text-amber-700 flex items-center gap-1 mb-2">
              <Icons.ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800">{courseData.title}</h1>
          </div>

          <div className="bg-stone-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-stone-900/10 min-h-[300px] md:min-h-[450px]">
            {activeLesson.type === 'video' ? (
              <VideoPlayer
                videoUrl={activeLesson.url}
                title={activeLesson.title}
                onComplete={handleLessonComplete}
              />
            ) : (
              <div className="h-full bg-stone-50 p-1">
                <QuizPlayer onComplete={handleLessonComplete} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                  {activeLesson.type === 'video' ? <Icons.PlayCircle className="w-5 h-5 text-amber-600" /> : <Icons.FileText className="w-5 h-5 text-amber-600" />}
                  {activeLesson.title}
                </h2>
                <p className="text-stone-500 text-sm mt-1">Lesson {activeIndex + 1} of {allLessons.length}</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={activeIndex === allLessons.length - 1}
                  className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-amber-700 text-white font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {activeIndex === allLessons.length - 1 ? 'Finish Course' : 'Next Lesson'}
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="prose prose-stone max-w-none">
              <h3 className="text-lg font-semibold text-stone-800">About this lesson</h3>
              <p className="text-stone-600">
                In this lesson, we will explore the core concepts required to understand {activeLesson.title}.
                Ensure you take notes and complete any attached exercises.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-stone-200 shadow-xl transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
          lg:translate-x-0 lg:static lg:h-auto lg:shadow-none lg:border-l lg:block`}
      >
        <div className="flex flex-col h-full pt-20 lg:pt-0">
          <div className="p-5 border-b border-stone-200 bg-stone-50 flex justify-between items-center lg:block">
            <h3 className="font-bold text-stone-800">Course Content</h3>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-stone-500">
              <Icons.X className="w-6 h-6" />
            </button>
            <div className="mt-2 w-full bg-stone-200 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <p className="text-xs text-stone-500 mt-1">15% Completed</p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {courseData.modules.map((module) => (
              <div key={module.id || module._id} className="mb-2">
                <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
                  {module.title}
                </div>
                <div className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const lessonId = lesson.id || lesson._id;
                    const isActive = lessonId === activeLessonId;
                    const isCompleted = courseData.completedLessonIds?.includes(lessonId);

                    return (
                      <button
                        key={lessonId}
                        onClick={() => {
                          handleLessonChange(lessonId);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 
                          ${isActive ? 'bg-amber-50 border border-amber-200 shadow-sm' : 'hover:bg-stone-50 border border-transparent'}`}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                          ) : isActive ? (
                            <div className="w-4 h-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-stone-300"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isActive ? 'text-amber-800' : 'text-stone-700'}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-stone-400 flex items-center gap-1">
                              {lesson.type === 'video' ? <Icons.PlayCircle className="w-3 h-3" /> : <Icons.FileText className="w-3 h-3" />}
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 lg:hidden z-50 bg-amber-700 text-white p-3 rounded-full shadow-lg hover:bg-amber-800 transition-colors"
        >
          <Icons.Menu className="w-6 h-6" />
        </button>
      )}

    </div>
  );
};

export default CourseRoom;