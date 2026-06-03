import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Info, Lock, Timer } from 'lucide-react';
import QuestionPanel from '../components/QuestionPanel.jsx';
import { exams, sampleQuestions } from '../data/exams.js';
import { useCountdown } from '../hooks/useCountdown.js';
import { formatSeconds } from '../utils/time.js';

export default function ExamPage() {
  const { examId } = useParams();
  const exam = useMemo(() => exams.find((item) => item.id === examId), [examId]);
  const session = useMemo(
    () => JSON.parse(window.localStorage.getItem('examPortalSession') || 'null'),
    [],
  );
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const totalExamSeconds = (exam?.duration ?? 45) * 60;
  const secondsRemaining = useCountdown(session ? totalExamSeconds : 0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const activeQuestion = sampleQuestions[activeQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = Math.round((answeredCount / sampleQuestions.length) * 100);
  const timerProgress = Math.round((secondsRemaining / totalExamSeconds) * 100);
  const isTimerWarning = secondsRemaining <= 300;
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    if (secondsRemaining === 0 && !isSubmitted) {
      submitExam('Time is over.');
    }
  }, [isSubmitted, secondsRemaining]);

  function calculateScore() {
    const correctCount = sampleQuestions.filter(
      (question) => selectedAnswers[question.id] === question.correctAnswer,
    ).length;
    const totalQuestions = sampleQuestions.length;
    const wrongCount = answeredCount - correctCount;
    const unansweredCount = totalQuestions - answeredCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const status = percentage >= 40 ? 'Passed' : 'Failed';

    return {
      examId: exam.id,
      examTitle: exam.title,
      correctCount,
      wrongCount,
      unansweredCount,
      answeredCount,
      totalQuestions,
      percentage,
      status,
      submittedAt: new Date().toISOString(),
    };
  }

  function submitExam(prefix = 'Exam submitted.') {
    const result = calculateScore();
    const previousResults = JSON.parse(
      window.localStorage.getItem('examPortalResultHistory') || '[]',
    );

    setIsSubmitted(true);
    setScoreResult(result);
    window.localStorage.setItem('examPortalLatestResult', JSON.stringify(result));
    window.localStorage.setItem(
      'examPortalResultHistory',
      JSON.stringify([result, ...previousResults].slice(0, 8)),
    );
    window.alert(`${prefix} Score: ${result.correctCount}/${result.totalQuestions} (${result.percentage}%).`);
  }

  if (!exam) {
    return <p className="empty-state">Exam not found.</p>;
  }

  if (!session) {
    const redirectPath = `/exam/${exam.id}`;

    return (
      <section className="auth-required-panel">
        <div className="auth-required-icon">
          <Lock size={28} />
        </div>
        <div>
          <p className="eyebrow">{exam.subject}</p>
          <h1>Login or register to start this exam</h1>
          <p>
            Student details are required before opening {exam.title}. Sign in with an
            existing account or create a new student account to continue.
          </p>
        </div>

        <div className="auth-required-details">
          <span>Exam: {exam.title}</span>
          <span>Duration: {exam.duration} minutes</span>
          <span>Questions: {sampleQuestions.length} MCQs</span>
        </div>

        <div className="auth-required-actions">
          <Link className="primary-button" to={`/login?redirect=${encodeURIComponent(redirectPath)}`}>
            Login
          </Link>
          <Link
            className="secondary-button"
            to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
          >
            Register
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="exam-page">
      <header className="exam-header">
        <div>
          <p className="eyebrow">{exam.subject}</p>
          <h1>{exam.title}</h1>
        </div>
        <strong className={isTimerWarning ? 'timer warning' : 'timer'}>
          {formatSeconds(secondsRemaining)}
        </strong>
      </header>

      <div className="exam-workspace">
        <div className="exam-main">
          <QuestionPanel
            question={activeQuestion}
            selectedAnswer={selectedAnswers[activeQuestion.id]}
            onSelectAnswer={(answer) =>
              setSelectedAnswers((current) => ({ ...current, [activeQuestion.id]: answer }))
            }
          />

          <div className="exam-actions">
            <button
              className="secondary-button"
              type="button"
              disabled={activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex((index) => index - 1)}
            >
              Previous
            </button>
            <button
              className="primary-button"
              type="button"
              disabled={activeQuestionIndex === sampleQuestions.length - 1}
              onClick={() => setActiveQuestionIndex((index) => index + 1)}
            >
              Next
            </button>
          </div>

          {scoreResult && (
            <section className="score-card">
              <div>
                <p className="eyebrow">Score Calculation</p>
                <h2>{scoreResult.percentage}%</h2>
              </div>
              <div className="score-grid">
                <span>Correct: {scoreResult.correctCount}</span>
                <span>Wrong: {scoreResult.wrongCount}</span>
                <span>Unanswered: {scoreResult.unansweredCount}</span>
                <span>Status: {scoreResult.status}</span>
              </div>
            </section>
          )}
        </div>

        <aside className="exam-side-panel" aria-label="Exam side sections">
          <section className="side-card">
            <div className="side-card-title">
              <Timer size={18} />
              <h2>Timer</h2>
            </div>
            <div className={isTimerWarning ? 'timer-box warning' : 'timer-box'}>
              <span>Remaining Time</span>
              <strong>{formatSeconds(secondsRemaining)}</strong>
              <small>{isTimerWarning ? 'Finish soon' : `${exam.duration} minutes total`}</small>
            </div>
            <div
              className={isTimerWarning ? 'timer-progress warning' : 'timer-progress'}
              aria-label={`${timerProgress}% time remaining`}
            >
              <span style={{ width: `${timerProgress}%` }} />
            </div>
          </section>

          <section className="side-card">
            <div className="side-card-title">
              <CheckCircle2 size={18} />
              <h2>Exam Status</h2>
            </div>
            <div className="status-list">
              <div>
                <span>Total Time</span>
                <strong>{exam.duration} min</strong>
              </div>
              <div>
                <span>Answered</span>
                <strong>
                  {answeredCount}/{sampleQuestions.length}
                </strong>
              </div>
              <div>
                <span>Progress</span>
                <strong>{progress}%</strong>
              </div>
            </div>
            <div className="progress-track" aria-label={`${progress}% completed`}>
              <span style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="side-card">
            <div className="side-card-title">
              <ClipboardList size={18} />
              <h2>Questions</h2>
            </div>
            <div className="question-map">
              {sampleQuestions.map((question, index) => {
                const isAnswered = Boolean(selectedAnswers[question.id]);
                const isActive = index === activeQuestionIndex;

                return (
                  <button
                    className={[
                      'question-map-button',
                      isActive ? 'active' : '',
                      isAnswered ? 'answered' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    type="button"
                    key={question.id}
                    onClick={() => setActiveQuestionIndex(index)}
                    aria-label={`Go to question ${question.number}`}
                  >
                    {question.number}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="side-card">
            <div className="side-card-title">
              <Info size={18} />
              <h2>Instructions</h2>
            </div>
            <ul className="instruction-list">
              <li>Select one option for each MCQ.</li>
              <li>Use the question numbers to jump between questions.</li>
              <li>Review unanswered questions before final submission.</li>
            </ul>
          </section>

          <button
            className="submit-exam-button"
            type="button"
            disabled={isSubmitted}
            onClick={() => submitExam()}
          >
            <CheckCircle2 size={18} />
            {isSubmitted ? 'Submitted' : 'Submit Exam'}
          </button>
        </aside>
      </div>
    </section>
  );
}
