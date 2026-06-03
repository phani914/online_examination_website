import { Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExamCard({ exam }) {
  return (
    <article className="exam-card">
      <div>
        <p className="eyebrow">{exam.subject}</p>
        <h2>{exam.title}</h2>
      </div>

      <div className="exam-meta">
        <span>
          <Clock size={16} />
          {exam.duration} min
        </span>
        <span>
          <FileText size={16} />
          {exam.questions} questions
        </span>
      </div>

      <Link className="primary-button" to={`/exam/${exam.id}`}>
        Start Exam
      </Link>
    </article>
  );
}
