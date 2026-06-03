import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    window.localStorage.setItem(
      'examPortalUser',
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    );
    window.localStorage.setItem(
      'examPortalSession',
      JSON.stringify({ email: formData.email }),
    );

    navigate(redirectPath);
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <GraduationCap size={28} />
          <span>ExamPortal</span>
        </div>

        <div className="auth-heading">
          <h1>Create account</h1>
          <p>Register once and start managing your exam attempts.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sandy Kumar"
              required
            />
          </label>
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
              placeholder="Create password"
              required
            />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </label>

          {message && <p className="auth-message error">{message}</p>}

          <button className="primary-button" type="submit">
            Register
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`}>Sign in</Link>
        </p>
      </section>
    </main>
  );
}
