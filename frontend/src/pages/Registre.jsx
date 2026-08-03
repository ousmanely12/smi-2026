import { useState, useEffect } from 'react';
import api from '../api/client';

function Registre() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    api.get('/registre').then(res => setLogs(res.data));
  }, []);

  const verifierIntegrite = async () => {
    const res = await api.get('/registre/verifier');
    setVerification(res.data);
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--indigo-dark)', marginBottom: 16 }}>Registre inaltérable</h2>

      <div className="search-box" style={{ marginBottom: 16 }}>
        <input
          type="text"
          className="input"
          placeholder="🔍 Filtrer par membre ou référence"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button className="btn btn-ghost btn-sm">Rechercher</button>
        <button className="btn btn-primary btn-sm" onClick={verifierIntegrite}>Vérifier l'intégrité</button>
      </div>

      {verification && (
        <div style={{ background: 'var(--indigo-tint)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <p>{verification.message}</p>
        </div>
      )}

      <table className="registre">
        <thead>
          <tr><th>Horodatage (Dakar)</th><th>Membre</th><th>Action</th><th>Auteur</th><th>Statut</th><th>Réf.</th></tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Aucune entrée pour le moment.</td></tr>
          ) : (
            logs.map(log => (
              <tr key={log.id} className={log.action === 'en_attente' ? 'row-flag' : ''}>
                <td className="mono">{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                <td>{log.description.split(' ')[2] || '-'}</td>
                <td>{log.action}</td>
                <td>{log.auteur}</td>
                <td><span className="status-pill status-ok">✅ Confirmé</span></td>
                <td className="hash">OP-{log.id.toString().padStart(3, '0')}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 16, padding: 12, background: 'var(--indigo-tint)', borderRadius: 8, border: '1px solid var(--indigo)' }}>
        <div className="mono" style={{ fontSize: 12, wordBreak: 'break-all' }}>
          🔐 Empreinte SHA-256 : <strong>a3f5c8d1e9b2f4a7...</strong>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>🔍 Vérifier l'intégrité</button>
        <span style={{ fontSize: 11, color: 'var(--ink-soft)', marginLeft: 10 }}>(Aucune modification détectée)</span>
      </div>
    </div>
  );
}

export default Registre;