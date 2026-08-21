import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles optionnel : liste des rôles autorisés. Si absent, tout utilisateur connecté passe.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}