import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Membres from './pages/Membres';
import Paiements from './pages/Paiements';
import Registre from './pages/Registre';
import Attestations from './pages/Attestations';
import Confidentialite from './pages/Confidentialite';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/membres" element={<ProtectedRoute><Layout><Membres /></Layout></ProtectedRoute>} />
        <Route path="/paiements" element={<ProtectedRoute><Layout><Paiements /></Layout></ProtectedRoute>} />
        <Route path="/registre" element={<ProtectedRoute><Layout><Registre /></Layout></ProtectedRoute>} />
        <Route path="/attestations" element={<ProtectedRoute><Layout><Attestations /></Layout></ProtectedRoute>} />
        <Route path="/confidentialite" element={<ProtectedRoute><Layout><Confidentialite /></Layout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;