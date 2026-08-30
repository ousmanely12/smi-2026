import { useNavigate } from 'react-router-dom'
import { Building2, ArrowRight } from 'lucide-react'

function App() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-brand">
            <div className="landing-logo-circle">
              <Building2 size={48} />
            </div>
            <h1 className="landing-title">BATIPME-SN</h1>
            <p className="landing-tagline">Logiciel de Gestion de Projets BTP</p>
            <p className="landing-subtitle">Adapté aux PME du Sénégal</p>
          </div>

          <div className="landing-cta">
            <button onClick={() => navigate('/login')} className="landing-btn landing-btn-primary">
              Se Connecter
              <ArrowRight size={20} />
            </button>
            <button onClick={() => navigate('/login')} className="landing-btn landing-btn-secondary">
              Découvrir
            </button>
          </div>

          <div className="landing-stats">
            <div className="landing-stat">
              <div className="landing-stat-value">10+</div>
              <div className="landing-stat-label">Modules</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-value">100%</div>
              <div className="landing-stat-label">Sécurisé</div>
            </div>
            <div className="landing-stat">
              <div className="landing-stat-value">24/7</div>
              <div className="landing-stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer-bar">
        <p>© 2026 BATIPME-SN. Tous droits réservés.</p>
      </footer>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: #0f172a;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
        }
        .landing-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }
        .landing-hero-content {
          position: relative; z-index: 1;
          text-align: center;
          max-width: 900px;
          width: 100%;
        }
        .landing-brand { margin-bottom: 48px; }
        .landing-logo-circle {
          width: 100px; height: 100px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          color: white;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
        }
        .landing-title {
          font-size: 56px; font-weight: 800;
          margin-bottom: 12px; color: #fff;
        }
        .landing-tagline {
          font-size: 20px; color: #94a3b8; margin-bottom: 8px;
        }
        .landing-subtitle {
          font-size: 15px; color: #64748b;
        }
        .landing-cta {
          display: flex; gap: 16px;
          justify-content: center;
          margin-bottom: 48px;
        }
        .landing-btn {
          display: inline-flex; align-items: center;
          gap: 10px; padding: 14px 32px;
          border-radius: 12px; font-size: 15px;
          font-weight: 600; cursor: pointer;
          border: none; font-family: 'Inter', sans-serif;
          transition: all 250ms ease;
        }
        .landing-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }
        .landing-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.5);
        }
        .landing-btn-secondary {
          background: rgba(255,255,255,0.05);
          color: #f8fafc;
          border: 1px solid rgba(148,163,184,0.12);
        }
        .landing-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }
        .landing-stats {
          display: flex; gap: 48px;
          justify-content: center;
        }
        .landing-stat { text-align: center; }
        .landing-stat-value {
          font-size: 32px; font-weight: 800;
          color: #3b82f6; margin-bottom: 4px;
        }
        .landing-stat-label {
          font-size: 13px; color: #64748b;
          text-transform: uppercase;
        }
        .landing-footer-bar {
          padding: 32px 20px;
          text-align: center;
          border-top: 1px solid rgba(148,163,184,0.12);
          font-size: 13px; color: #64748b;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .landing-hero { padding: 40px 16px; min-height: calc(100vh - 80px); }
          .landing-logo-circle { width: 80px; height: 80px; }
          .landing-logo-circle svg { width: 36px; height: 36px; }
          .landing-title { font-size: 36px; }
          .landing-tagline { font-size: 16px; }
          .landing-subtitle { font-size: 13px; }
          .landing-brand { margin-bottom: 36px; }
          .landing-cta {
            flex-direction: column;
            align-items: center;
            margin-bottom: 36px;
          }
          .landing-btn {
            width: 100%; max-width: 280px;
            justify-content: center;
          }
          .landing-stats { gap: 24px; }
          .landing-stat-value { font-size: 24px; }
          .landing-stat-label { font-size: 11px; }
        }
        @media (max-width: 480px) {
          .landing-title { font-size: 30px; }
          .landing-tagline { font-size: 14px; }
          .landing-stats { flex-direction: column; gap: 16px; }
          .landing-logo-circle { width: 64px; height: 64px; margin-bottom: 16px; }
          .landing-logo-circle svg { width: 30px; height: 30px; }
        }
      `}</style>
    </div>
  )
}

export default App
