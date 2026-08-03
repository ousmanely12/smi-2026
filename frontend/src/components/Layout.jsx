import { Outlet, Link, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="wrap">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>Tontine</h1>
        <nav>
          <Link to="/dashboard" style={{ marginRight: 16 }}>Mes pots</Link>
          <Link to="/membres" style={{ marginRight: 16 }}>Membres</Link>
          <Link to="/paiements" style={{ marginRight: 16 }}>Paiements</Link>
          <Link to="/registre" style={{ marginRight: 16 }}>Registre</Link>
          <Link to="/attestations" style={{ marginRight: 16 }}>Attestations</Link>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--brick)', cursor: 'pointer' }}>Déconnexion</button>
        </nav>
      </header>
      <main style={{ padding: '20px 0' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;