import {
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  PenSquare,
  UserPlus,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <GraduationCap size={28} />
          <span>ExamPortal</span>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          <NavLink to="/" end>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/exams">
            <ClipboardList size={18} />
            Exams
          </NavLink>
          <NavLink to="/exam/math-101">
            <PenSquare size={18} />
            Demo Exam
          </NavLink>
          <NavLink to="/results">
            <BarChart3 size={18} />
            Results
          </NavLink>
          <NavLink to="/submissions">
            <ClipboardCheck size={18} />
            Submissions
          </NavLink>
        </nav>

        <nav className="sidebar-actions" aria-label="Account navigation">
          <NavLink to="/login">
            <LogIn size={18} />
            Login
          </NavLink>
          <NavLink to="/register">
            <UserPlus size={18} />
            Sign Up
          </NavLink>
          <NavLink
            className="logout-link"
            to="/login"
            onClick={() => window.localStorage.removeItem('examPortalSession')}
          >
            <LogOut size={18} />
            Logout
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        {children}

        <footer className="app-footer">
          <div>
            <strong>ExamPortal</strong>
            <span>Secure online assessments with results and submission tracking.</span>
          </div>
          <nav aria-label="Footer navigation">
            <NavLink to="/exams">Exams</NavLink>
            <NavLink to="/results">Results</NavLink>
            <NavLink to="/submissions">Submissions</NavLink>
          </nav>
        </footer>
      </main>
    </div>
  );
}
