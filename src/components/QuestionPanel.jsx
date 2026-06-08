export default function QuestionPanel({ question, selectedAnswer, onSelectAnswer, isLocked = false }) {
  return (
    <section className="question-panel">
      <p className="eyebrow">Question {question.number}</p>
      <h1>{question.prompt}</h1>

      <div className="answer-list">
        {question.options.map((option) => (
          <label
            className={selectedAnswer === option ? 'answer-option selected' : 'answer-option'}
            key={option}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedAnswer === option}
              onChange={() => onSelectAnswer(option)}
              disabled={isLocked}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
