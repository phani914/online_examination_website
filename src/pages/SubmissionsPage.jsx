import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Timer,
  UserRound,
  XCircle,
} from 'lucide-react';
import { formatSeconds } from '../utils/time.js';

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function formatDateTime(value) {
  if (!value) return 'Not available';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function getSubmissionLabel(type) {
  return type === 'timeout' ? 'Auto submitted' : 'Manual submission';
}

export default function SubmissionsPage() {
  const submissions = useMemo(() => {
    const history = readJson('examPortalResultHistory', []);
    const latestResult = readJson('examPortalLatestResult', null);
    const records = history.length > 0 ? history : latestResult ? [latestResult] : [];

    return records.map((record, index) => ({
      attemptId: record.attemptId || `${record.examId || record.examTitle}-${record.submittedAt}-${index}`,
      submissionType: record.submissionType || 'manual',
      answers: record.answers || [],
      ...record,
    }));
  }, []);

  const totalSubmissions = submissions.length;
  const manualCount = submissions.filter((submission) => submission.submissionType !== 'timeout').length;
  const autoCount = totalSubmissions - manualCount;
  const latestSubmission = submissions[0];

  if (totalSubmissions === 0) {
    return (
      <section className="submission-page">
        <header className="page-header">
          <p className="eyebrow">Submissions</p>
          <h1>Submission Details</h1>
        </header>

        <div className="empty-state submission-empty">
          <ClipboardCheck size={34} />
          <div>
            <h2>No submissions yet</h2>
            <p>Complete an exam to see submission time, score, student details, and answer review.</p>
          </div>
          <Link className="primary-button" to="/exams">
            View Exams
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="submission-page">
      <header className="page-header">
        <p className="eyebrow">Submissions</p>
        <h1>Submission Details</h1>
      </header>

      <section className="submission-overview" aria-label="Submission overview">
        <article>
          <ClipboardCheck size={22} />
          <span>Total Submissions</span>
          <strong>{totalSubmissions}</strong>
        </article>
        <article>
          <CheckCircle2 size={22} />
          <span>Manual</span>
          <strong>{manualCount}</strong>
        </article>
        <article>
          <Timer size={22} />
          <span>Auto Submitted</span>
          <strong>{autoCount}</strong>
        </article>
        <article>
          <Clock size={22} />
          <span>Latest</span>
          <strong>{formatDateTime(latestSubmission.submittedAt)}</strong>
        </article>
      </section>

      <div className="submission-list">
        {submissions.map((submission) => {
          const answeredCount =
            submission.answeredCount ??
            submission.totalQuestions - submission.unansweredCount;
          const answerReview = submission.answers.slice(0, 5);

          return (
            <article className="submission-card" key={submission.attemptId}>
              <header className="submission-card-header">
                <div>
                  <p className="eyebrow">{submission.subject || 'Exam Submission'}</p>
                  <h2>{submission.examTitle}</h2>
                </div>
                <span
                  className={
                    submission.submissionType === 'timeout'
                      ? 'status-pill failed'
                      : 'status-pill'
                  }
                >
                  {getSubmissionLabel(submission.submissionType)}
                </span>
              </header>

              <div className="submission-detail-grid">
                <div>
                  <UserRound size={18} />
                  <span>Student</span>
                  <strong>{submission.studentName || 'Student'}</strong>
                  <small>{submission.studentEmail || submission.submittedBy || 'No email'}</small>
                </div>
                <div>
                  <FileText size={18} />
                  <span>Score</span>
                  <strong>{submission.percentage}%</strong>
                  <small>
                    {submission.correctCount}/{submission.totalQuestions} correct
                  </small>
                </div>
                <div>
                  <Clock size={18} />
                  <span>Submitted</span>
                  <strong>{formatDateTime(submission.submittedAt)}</strong>
                  <small>Started {formatDateTime(submission.startedAt)}</small>
                </div>
                <div>
                  <Timer size={18} />
                  <span>Time</span>
                  <strong>{formatSeconds(submission.timeSpentSeconds || 0)}</strong>
                  <small>
                    {formatSeconds(submission.remainingSeconds || 0)} remaining
                  </small>
                </div>
              </div>

              <div className="submission-score-grid">
                <span>Answered: {answeredCount}</span>
                <span>Correct: {submission.correctCount}</span>
                <span>Wrong: {submission.wrongCount}</span>
                <span>Unanswered: {submission.unansweredCount}</span>
                <span>Status: {submission.status}</span>
              </div>

              {answerReview.length > 0 && (
                <section className="answer-review" aria-label={`${submission.examTitle} answer review`}>
                  <h3>Answer Review</h3>
                  {answerReview.map((answer) => (
                    <div className="answer-review-row" key={answer.questionId}>
                      <div>
                        <strong>Q{answer.questionNumber}</strong>
                        <p>{answer.prompt}</p>
                      </div>
                      <span
                        className={
                          answer.status === 'Correct'
                            ? 'answer-status correct'
                            : answer.status === 'Wrong'
                              ? 'answer-status wrong'
                              : 'answer-status'
                        }
                      >
                        {answer.status}
                      </span>
                      <small>
                        Your answer: {answer.selectedAnswer || 'Not answered'}
                        <br />
                        Correct: {answer.correctAnswer}
                      </small>
                    </div>
                  ))}
                  {submission.answers.length > answerReview.length && (
                    <p className="answer-review-note">
                      Showing first {answerReview.length} of {submission.answers.length} questions.
                    </p>
                  )}
                </section>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
