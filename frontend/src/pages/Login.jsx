import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [telephone, setTelephone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const requestOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telephone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      alert(`Code OTP : ${data.code}`);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telephone, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Connexion Tontine</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="+221 77 000 00 00"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        style={{ width: '100%', padding: 12, marginBottom: 10, border: '1px solid #ccc', borderRadius: 6 }}
      />
      {step === 2 && (
        <input
          type="text"
          placeholder="Code OTP (6 chiffres)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: '100%', padding: 12, marginBottom: 10, border: '1px solid #ccc', borderRadius: 6 }}
        />
      )}
      <button
        onClick={step === 1 ? requestOtp : verifyOtp}
        disabled={loading}
        style={{ width: '100%', padding: 12, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer' }}
      >
        {loading ? 'Chargement...' : step === 1 ? '📲 Recevoir le code' : '✅ Vérifier'}
      </button>
    </div>
  );
}

export default Login;