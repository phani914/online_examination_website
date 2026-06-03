import { GraduationCap } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const demoUser = { email: 'student@example.com', password: 'student123' };
    const savedUser = JSON.parse(window.localStorage.getItem('examPortalUser') || 'null');
    const allowedUsers = [demoUser, savedUser].filter(Boolean);

    const isValidUser = allowedUsers.some(
      (user) => formData.email === user.email && formData.password === user.password,
    );

    if (isValidUser) {
      window.localStorage.setItem('examPortalSession', JSON.stringify({ email: formData.email }));
      navigate(redirectPath);
      return;
    }

    setMessage('Invalid email or password. Try student@example.com and student123.');
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <GraduationCap size={28} />
          <span>ExamPortal</span>
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your exams.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="student123"
              required
            />
          </label>

          {message && <p className="auth-message error">{message}</p>}

          <button className="primary-button" type="submit">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          New to ExamPortal?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`}>
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
