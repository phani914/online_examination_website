import { ClipboardList, GraduationCap, LogOut } from 'lucide-react';
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
            <ClipboardList size={18} />
            Home
          </NavLink>
          <NavLink to="/results">
            <GraduationCap size={18} />
            Results
          </NavLink>
        </nav>

        <NavLink
          className="logout-link"
          to="/login"
          onClick={() => window.localStorage.removeItem('examPortalSession')}
        >
          <LogOut size={18} />
          Logout
        </NavLink>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
