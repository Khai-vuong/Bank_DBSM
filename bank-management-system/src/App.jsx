import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserPage } from './pages/UserPage';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  // For simplicity, we'll use a dummy authentication state
  const isAuthenticated = true;
  const userRole = 'manager'; // or 'user'

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              userRole === 'manager' ? (
                <Navigate to="/manager" replace />
              ) : (
                <Navigate to="/user" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/user"
          element={
            isAuthenticated && userRole === 'user' ? (
              <UserPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/manager/*"
          element={
            isAuthenticated && userRole === 'manager' ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

