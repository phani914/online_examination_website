import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ExamPage from '../pages/ExamPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ResultsPage from '../pages/ResultsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'exam/:examId', element: <ExamPage /> },
      { path: 'results', element: <ResultsPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);
