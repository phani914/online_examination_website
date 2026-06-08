import { BookOpenCheck, Clock, FileText, GraduationCap } from 'lucide-react';
import ExamCard from '../components/ExamCard.jsx';
import { exams } from '../data/exams.js';

export default function ExamsPage() {
  const totalQuestions = exams.reduce((total, exam) => total + exam.questions, 0);
  const totalMinutes = exams.reduce((total, exam) => total + exam.duration, 0);

  return (
    <section className="exams-page">
      <section className="exam-catalog-hero">
        <div>
          <p className="eyebrow">Exam Catalog</p>
          <h1>Choose an assessment and begin when you are ready.</h1>
          <p>
            Each exam has a fixed timer, single-choice questions, automatic scoring,
            and a saved submission record after completion.
          </p>
        </div>

        <div className="catalog-summary" aria-label="Exam catalog summary">
          <div>
            <BookOpenCheck size={20} />
            <strong>{exams.length}</strong>
            <span>Exams</span>
          </div>
          <div>
            <FileText size={20} />
            <strong>{totalQuestions}</strong>
            <span>Questions</span>
          </div>
          <div>
            <Clock size={20} />
            <strong>{totalMinutes}</strong>
            <span>Minutes</span>
          </div>
        </div>
      </section>

      <section className="page-stack">
        <header className="section-header">
          <div>
            <p className="eyebrow">Available Exams</p>
            <h1>Assessment List</h1>
          </div>
          <span className="section-note">Select one exam to start</span>
        </header>

        <div className="exam-grid catalog-grid">
          {exams.map((exam) => (
            <ExamCard exam={exam} key={exam.id} />
          ))}
        </div>
      </section>

      <section className="exam-guidelines">
        <div className="side-card-title">
          <GraduationCap size={20} />
          <h2>Before You Start</h2>
        </div>
        <ul className="instruction-list">
          <li>Login or register before opening an exam.</li>
          <li>Keep track of the timer and submit before time runs out.</li>
          <li>After submission, check Results for scores and Submissions for details.</li>
        </ul>
      </section>
    </section>
  );
}
