import { Routes, Route, Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import CreateEvent from './pages/CreateEvent';
import Attendees from './pages/Attendees';
import ManageCommunity from './pages/ManageCommunity';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';

function Layout() {
  return (
    <>
      <NavBar />
      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/discover" element={<Discover />} />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
        <Route
          path="/messages"
          element={<ProtectedRoute><Messages /></ProtectedRoute>}
        />
        <Route
          path="/events/create"
          element={<ProtectedRoute><CreateEvent /></ProtectedRoute>}
        />
        <Route
          path="/events/attendees"
          element={<ProtectedRoute><Attendees /></ProtectedRoute>}
        />
        <Route
          path="/community/manage"
          element={<ProtectedRoute><ManageCommunity /></ProtectedRoute>}
        />
        <Route
          path="/audit-logs"
          element={<ProtectedRoute><AuditLogs /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><Settings /></ProtectedRoute>}
        />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
