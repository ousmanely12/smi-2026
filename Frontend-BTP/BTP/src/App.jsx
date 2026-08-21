import { useNavigate } from 'react-router-dom'
import { Building2, ArrowRight } from 'lucide-react'

function App() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
              <Building2 size={48} />
            </div>
            <h1 style={{ fontSize: '56px', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>BATIPME-SN</h1>
            <p style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '8px' }}>Logiciel de Gestion de Projets BTP</p>
            <p style={{ fontSize: '15px', color: '#64748b' }}>Adapté aux PME du Sénégal 🇸🇳</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '48px' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white' }}
            >
              Se Connecter
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(148, 163, 184, 0.12)', background: 'rgba(255, 255, 255, 0.05)', color: '#f8fafc' }}
            >
              Découvrir
            </button>
          </div>

          <div style={{ display: 'flex', gap: '48px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6', marginBottom: '4px' }}>10+</div>
              <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Modules</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6', marginBottom: '4px' }}>100%</div>
              <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Sécurisé</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6', marginBottom: '4px' }}>24/7</div>
              <div style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Support</div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '32px 20px', textAlign: 'center', borderTop: '1px solid rgba(148, 163, 184, 0.12)', fontSize: '13px', color: '#64748b' }}>
        <p>© 2026 BATIPME-SN. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default App
