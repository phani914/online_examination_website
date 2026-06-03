import { ArrowRight, BarChart3, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExamCard from '../components/ExamCard.jsx';
import { exams } from '../data/exams.js';

export default function DashboardPage() {
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
            <Link className="primary-button hero-button" to="/exam/math-101">
              Start Demo Exam
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
          <strong>12k+</strong>
          <span>Exams completed</span>
        </div>
        <div>
          <strong>98%</strong>
          <span>Submission success</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Exam access</span>
        </div>
      </section>

      <section className="feature-grid" aria-label="Platform features">
        <article>
          <ShieldCheck size={24} />
          <h2>Secure Attempts</h2>
          <p>Structured sessions, timed tests, and clear exam flow for reliable assessment.</p>
        </article>
        <article>
          <BarChart3 size={24} />
          <h2>Instant Insights</h2>
          <p>Results are easy to review, compare, and act on after each assessment.</p>
        </article>
        <article>
          <Clock size={24} />
          <h2>Timed Workflow</h2>
          <p>Students always know how much time remains and where they are in the test.</p>
        </article>
      </section>

      <section className="page-stack">
        <header className="section-header">
          <div>
            <p className="eyebrow">Student Dashboard</p>
            <h1>Available Exams</h1>
          </div>
          <span className="section-note">Choose an exam to begin</span>
        </header>

        <div className="exam-grid">
          {exams.map((exam) => (
            <ExamCard exam={exam} key={exam.id} />
          ))}
        </div>
      </section>
    </section>
  );
}
