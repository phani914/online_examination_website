import { useMemo } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { exams } from '../data/exams.js';

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export default function DashboardPage() {
  const dashboard = useMemo(() => {
    const results = readJson('examPortalResultHistory', []);
    const latestResult = readJson('examPortalLatestResult', null);
    const submissions = results.length > 0 ? results : latestResult ? [latestResult] : [];
    const completedCount = submissions.length;
    const averageScore =
      completedCount > 0
        ? Math.round(
            submissions.reduce((total, result) => total + result.percentage, 0) / completedCount,
          )
        : 0;
    const passedCount = submissions.filter((result) => result.status === 'Passed').length;

    return {
      submissions,
      completedCount,
      averageScore,
      passedCount,
      latestResult: submissions[0],
    };
  }, []);

  return (
    <section className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Online Examination Platform</p>
          <h1>Conduct secure exams and track performance with confidence.</h1>
          <p className="hero-summary">
            ExamPortal gives students a focused testing experience while educators can
            monitor attempts, publish results, and keep every assessment organized.
          </p>

          <div className="hero-actions">
            <Link className="primary-button hero-button" to="/login">
              Login
            </Link>
            <Link className="secondary-button hero-button" to="/register">
              Register
            </Link>
            <Link className="primary-button hero-button" to="/exams">
              Browse Exams
              <ArrowRight size={18} />
            </Link>
            <Link className="ghost-button hero-button" to="/results">
              View Results
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="Exam dashboard preview">
          <div className="preview-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-content">
            <div className="preview-question">
              <p>Question 12 of 30</p>
              <strong>Which option best describes FIFO ordering?</strong>
              <div className="preview-answer selected">Queue</div>
              <div className="preview-answer">Stack</div>
              <div className="preview-answer">Tree</div>
            </div>
            <div className="preview-sidebar">
              <div>
                <Clock size={18} />
                <span>32:18</span>
              </div>
              <div>
                <CheckCircle2 size={18} />
                <span>18 Answered</span>
              </div>
              <div>
                <ShieldCheck size={18} />
                <span>Proctored</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-strip" aria-label="Platform statistics">
        <div>
          <strong>{exams.length}</strong>
          <span>Available exams</span>
        </div>
        <div>
          <strong>{dashboard.completedCount}</strong>
          <span>Your submissions</span>
        </div>
        <div>
          <strong>{dashboard.averageScore}%</strong>
          <span>Average score</span>
        </div>
      </section>

      <section className="dashboard-grid" aria-label="Dashboard summary">
        <article>
          <div className="side-card-title">
            <ClipboardCheck size={20} />
            <h2>Latest Attempt</h2>
          </div>
          {dashboard.latestResult ? (
            <div className="dashboard-latest">
              <strong>{dashboard.latestResult.examTitle}</strong>
              <span>
                {dashboard.latestResult.percentage}% - {dashboard.latestResult.status}
              </span>
              <Link className="secondary-button" to="/submissions">
                View Submission
              </Link>
            </div>
          ) : (
            <div className="dashboard-latest">
              <strong>No attempts yet</strong>
              <span>Start an exam to create your first submission record.</span>
              <Link className="secondary-button" to="/exams">
                Choose Exam
              </Link>
            </div>
          )}
        </article>
        <article>
          <BarChart3 size={24} />
          <h2>Performance Snapshot</h2>
          <div className="dashboard-mini-stats">
            <span>Passed: {dashboard.passedCount}</span>
            <span>Average: {dashboard.averageScore}%</span>
            <span>Records: {dashboard.completedCount}</span>
          </div>
        </article>
        <article>
          <Clock size={24} />
          <h2>Next Recommended</h2>
          <p>{exams[0].title}</p>
          <Link className="primary-button" to={`/exam/${exams[0].id}`}>
            Start Demo
          </Link>
        </article>
      </section>

      <section className="feature-grid" aria-label="Platform features">
        <article>
          <ShieldCheck size={24} />
          <h2>Secure Attempts</h2>
          <p>Structured sessions, timed tests, and clear exam flow for reliable assessment.</p>
        </article>
        <article>
          <FileText size={24} />
          <h2>Submission Records</h2>
          <p>Every attempt stores score, timing, status, and answer review details.</p>
        </article>
        <article>
          <CheckCircle2 size={24} />
          <h2>Quick Review</h2>
          <p>Use results and submissions pages to track progress after each exam.</p>
        </article>
      </section>

      <section className="dashboard-actions">
        <header className="section-header">
          <div>
            <p className="eyebrow">Quick Actions</p>
            <h1>Continue Your Workflow</h1>
          </div>
        </header>

        <Link to="/exams">
          <FileText size={20} />
          Browse all exams
        </Link>
        <Link to="/results">
          <BarChart3 size={20} />
          Check result dashboard
        </Link>
        <Link to="/submissions">
          <ClipboardCheck size={20} />
          Review submissions
        </Link>
      </section>
    </section>
  );
}
