import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const secondsRemaining = useCountdown(
    session ? totalExamSeconds : 0,
    Boolean(session) && !isSubmitted,
  );
  const activeQuestion = sampleQuestions[activeQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = Math.round((answeredCount / sampleQuestions.length) * 100);
  const timerProgress = Math.max(0, Math.round((secondsRemaining / totalExamSeconds) * 100));
  const isTimerWarning = secondsRemaining > 0 && secondsRemaining <= 300;
  const [scoreResult, setScoreResult] = useState(null);
  const [submissionNotice, setSubmissionNotice] = useState(null);
  const hasFinalizedSubmission = useRef(false);
  const examStartedAt = useRef(new Date().toISOString());

  const calculateScore = useCallback((submissionType) => {
    const savedUser = JSON.parse(window.localStorage.getItem('examPortalUser') || 'null');
    const studentName = savedUser?.email === session?.email ? savedUser.name : 'Demo Student';
    const correctCount = sampleQuestions.filter(
      (question) => selectedAnswers[question.id] === question.correctAnswer,
    ).length;
    const totalQuestions = sampleQuestions.length;
    const wrongCount = answeredCount - correctCount;
    const unansweredCount = totalQuestions - answeredCount;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const status = percentage >= 40 ? 'Passed' : 'Failed';

    return {
      attemptId: `${exam.id}-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      studentName,
      studentEmail: session?.email ?? 'guest',
      correctCount,
      wrongCount,
      unansweredCount,
      answeredCount,
      totalQuestions,
      percentage,
      status,
      submittedBy: session?.email ?? 'guest',
      submissionType,
      startedAt: examStartedAt.current,
      submittedAt: new Date().toISOString(),
      durationMinutes: exam.duration,
      timeSpentSeconds: Math.max(totalExamSeconds - secondsRemaining, 0),
      remainingSeconds: Math.max(secondsRemaining, 0),
      answers: sampleQuestions.map((question) => {
        const selectedAnswer = selectedAnswers[question.id] || null;

        return {
          questionId: question.id,
          questionNumber: question.number,
          prompt: question.prompt,
          selectedAnswer,
          correctAnswer: question.correctAnswer,
          status: selectedAnswer
            ? selectedAnswer === question.correctAnswer
              ? 'Correct'
              : 'Wrong'
            : 'Unanswered',
        };
      }),
    };
  }, [answeredCount, exam, secondsRemaining, selectedAnswers, session, totalExamSeconds]);

  const saveResult = useCallback((result) => {
    const previousResults = JSON.parse(
      window.localStorage.getItem('examPortalResultHistory') || '[]',
    );

    window.localStorage.setItem('examPortalLatestResult', JSON.stringify(result));
    window.localStorage.setItem(
      'examPortalResultHistory',
      JSON.stringify([result, ...previousResults].slice(0, 8)),
    );
  }, []);

  const finalizeSubmission = useCallback((submissionType = 'manual') => {
    if (!exam || hasFinalizedSubmission.current) return;

    hasFinalizedSubmission.current = true;
    const result = calculateScore(submissionType);

    saveResult(result);
    setIsSubmitted(true);
    setScoreResult(result);
    setSubmissionNotice({
      title: submissionType === 'timeout' ? 'Time is over' : 'Exam submitted',
      message:
        submissionType === 'timeout'
          ? 'Your answers were submitted automatically after the timer ended.'
          : 'Your answers were submitted successfully.',
    });
  }, [calculateScore, exam, saveResult]);

  const handleManualSubmit = useCallback(() => {
    if (isSubmitted) return;

    const unansweredCount = sampleQuestions.length - answeredCount;

    if (unansweredCount > 0) {
      const shouldSubmit = window.confirm(
        `${unansweredCount} question${unansweredCount > 1 ? 's are' : ' is'} unanswered. Submit anyway?`,
      );

      if (!shouldSubmit) return;
    }

    finalizeSubmission('manual');
  }, [answeredCount, finalizeSubmission, isSubmitted]);

  useEffect(() => {
    if (session && secondsRemaining === 0 && !isSubmitted) {
      finalizeSubmission('timeout');
    }
  }, [finalizeSubmission, isSubmitted, secondsRemaining, session]);

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
            isLocked={isSubmitted}
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
            onClick={handleManualSubmit}
          >
            <CheckCircle2 size={18} />
            {isSubmitted ? 'Submitted' : 'Submit Exam'}
          </button>
        </aside>
      </div>

      {submissionNotice && scoreResult && (
        <div className="submission-modal-backdrop" role="presentation">
          <section
            className="submission-modal"
            role="alertdialog"
            aria-labelledby="submission-title"
            aria-describedby="submission-message"
          >
            <div>
              <p className="eyebrow">Submission Complete</p>
              <h2 id="submission-title">{submissionNotice.title}</h2>
              <p id="submission-message">{submissionNotice.message}</p>
            </div>
            <div className="submission-summary">
              <span>Score</span>
              <strong>
                {scoreResult.correctCount}/{scoreResult.totalQuestions}
              </strong>
              <small>{scoreResult.percentage}% - {scoreResult.status}</small>
            </div>
            <div className="submission-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setSubmissionNotice(null)}
              >
                Review Answers
              </button>
              <Link className="primary-button" to="/results">
                View Results
              </Link>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
