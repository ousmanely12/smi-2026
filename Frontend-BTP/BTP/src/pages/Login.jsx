import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, motDePasse);
      navigate('/');
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 95, 0.8) 50%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '32px' }}>
          <Building2 size={64} />
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>BATIPME-SN</h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', marginBottom: '8px' }}>Logiciel de Gestion de Projets BTP</p>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Adapté aux PME du Sénégal 🇸🇳</p>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Bienvenue</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Connectez-vous pour accéder à votre espace</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px' }}>Adresse email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type="email"
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px', color: '#f8fafc', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                  placeholder="exemple@batipme.sn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '12px', color: '#f8fafc', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', borderRadius: '8px' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'none' }}>Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)' }}
            >
              {loading ? 'Connexion...' : (
                <>
                  Se connecter
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>Vous n'avez pas de compte ?</p>
            <a href="#" style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Contactez votre administrateur</a>
          </div>
        </div>
      </div>
    </div>
  );
}
