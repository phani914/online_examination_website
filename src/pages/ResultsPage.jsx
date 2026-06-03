import { useMemo } from 'react';
import { Award, BarChart3, CheckCircle2, Clock, XCircle } from 'lucide-react';

const fallbackResults = [
  {
    examTitle: 'Algebra Fundamentals',
    correctCount: 26,
    wrongCount: 3,
    unansweredCount: 1,
    totalQuestions: 30,
    percentage: 86,
    status: 'Passed',
    submittedAt: '2026-06-01T10:30:00.000Z',
  },
  {
    examTitle: 'Physics Basics',
    correctCount: 31,
    wrongCount: 7,
    unansweredCount: 2,
    totalQuestions: 40,
    percentage: 78,
    status: 'Passed',
    submittedAt: '2026-05-28T09:10:00.000Z',
  },
];

function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export default function ResultsPage() {
  const results = useMemo(() => {
    const history = JSON.parse(window.localStorage.getItem('examPortalResultHistory') || '[]');
    const latestResult = JSON.parse(window.localStorage.getItem('examPortalLatestResult') || 'null');

    if (history.length > 0) return history;
    if (latestResult) return [latestResult, ...fallbackResults];
    return fallbackResults;
  }, []);

  const latestResult = results[0];
  const averageScore = Math.round(
    results.reduce((total, result) => total + result.percentage, 0) / results.length,
  );
  const passedCount = results.filter((result) => result.status === 'Passed').length;
  const bestResult = results.reduce(
    (best, result) => (result.percentage > best.percentage ? result : best),
    results[0],
  );

  return (
    <section className="result-dashboard">
      <header className="page-header">
        <p className="eyebrow">Performance</p>
        <h1>Result Dashboard</h1>
      </header>

      <section className="result-hero" aria-label="Latest result summary">
        <div>
          <p className="eyebrow">Latest Attempt</p>
          <h2>{latestResult.examTitle}</h2>
          <p>
            {latestResult.correctCount} correct out of {latestResult.totalQuestions} questions.
          </p>
        </div>
        <div className={latestResult.status === 'Passed' ? 'result-score' : 'result-score failed'}>
          <strong>{latestResult.percentage}%</strong>
          <span>{latestResult.status}</span>
        </div>
      </section>

      <section className="result-stat-grid" aria-label="Result statistics">
        <article>
          <Award size={22} />
          <span>Best Score</span>
          <strong>{bestResult.percentage}%</strong>
        </article>
        <article>
          <BarChart3 size={22} />
          <span>Average Score</span>
          <strong>{averageScore}%</strong>
        </article>
        <article>
          <CheckCircle2 size={22} />
          <span>Passed Exams</span>
          <strong>
            {passedCount}/{results.length}
          </strong>
        </article>
        <article>
          <Clock size={22} />
          <span>Latest Date</span>
          <strong>{formatDate(latestResult.submittedAt)}</strong>
        </article>
      </section>

      <section className="result-breakdown">
        <article>
          <div className="side-card-title">
            <CheckCircle2 size={18} />
            <h2>Answer Breakdown</h2>
          </div>
          <div className="breakdown-list">
            <span style={{ width: `${latestResult.percentage}%` }}>
              Correct {latestResult.correctCount}
            </span>
            <span
              style={{
                width: `${Math.round((latestResult.wrongCount / latestResult.totalQuestions) * 100)}%`,
              }}
            >
              Wrong {latestResult.wrongCount}
            </span>
            <span
              style={{
                width: `${Math.round(
                  (latestResult.unansweredCount / latestResult.totalQuestions) * 100,
                )}%`,
              }}
            >
              Unanswered {latestResult.unansweredCount}
            </span>
          </div>
        </article>

        <article>
          <div className="side-card-title">
            <XCircle size={18} />
            <h2>Review Focus</h2>
          </div>
          <ul className="instruction-list">
            <li>Revisit topics from incorrect questions first.</li>
            <li>Attempt skipped questions in the next practice round.</li>
            <li>Keep your average score above 70% for exam readiness.</li>
          </ul>
        </article>
      </section>

      <section className="page-stack">
        <header className="section-header">
          <div>
            <p className="eyebrow">History</p>
            <h1>Recent Attempts</h1>
          </div>
          <span className="section-note">{results.length} records</span>
        </header>

        <div className="results-table" role="table" aria-label="Recent exam results">
          <div role="row">
            <strong>Exam</strong>
            <strong>Score</strong>
            <strong>Correct</strong>
            <strong>Date</strong>
            <strong>Status</strong>
          </div>
          {results.map((result, index) => (
            <div role="row" key={`${result.examTitle}-${result.submittedAt}-${index}`}>
              <span>{result.examTitle}</span>
              <span>{result.percentage}%</span>
              <span>
                {result.correctCount}/{result.totalQuestions}
              </span>
              <span>{formatDate(result.submittedAt)}</span>
              <span className={result.status === 'Passed' ? 'status-pill' : 'status-pill failed'}>
                {result.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
