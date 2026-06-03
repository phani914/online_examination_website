export default function QuestionPanel({ question, selectedAnswer, onSelectAnswer }) {
  return (
    <section className="question-panel">
      <p className="eyebrow">Question {question.number}</p>
      <h1>{question.prompt}</h1>

      <div className="answer-list">
        {question.options.map((option) => (
          <label className="answer-option" key={option}>
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={selectedAnswer === option}
              onChange={() => onSelectAnswer(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
