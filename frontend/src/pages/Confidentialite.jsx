import { useState, useEffect } from 'react';
import api from '../api/client';

function Confidentialite() {
  const [membre, setMembre] = useState(null);

  useEffect(() => {
    // Récupérer un membre exemple (ou laisser l'utilisateur choisir)
    api.get('/pots').then(res => {
      const firstPot = res.data[0];
      if (firstPot) {
        api.get(`/pots/${firstPot.id}/membres`).then(res2 => {
          if (res2.data.length > 0) setMembre(res2.data[0]);
        });
      }
    });
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--indigo-dark)', marginBottom: 16 }}>Confidentialité et droits (CDP)</h2>

      {membre && (
        <div style={{ background: 'var(--paper)', padding: 24, borderRadius: 10, border: '1px solid var(--line)' }}>
          <div className="lock-badge">🔒 Chiffré AES-256 · accès restreint à la trésorière</div>

          <div style={{ marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div><div className="member-name">Consentement de conservation</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Donné le 01/07/2026 pour CNI (recto/verso) et données de cotisation.</div>
              </div>
              <span className="status-pill status-ok">accordé</span>
            </div>
          </div>

          <div style={{ marginTop: 18, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            <div className="member-name">Droit d'accès</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Le membre peut demander une copie de ses données.</div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>Exporter les données du membre</button>
          </div>

          <div style={{ marginTop: 18, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            <div className="member-name">Droit de suppression</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
              ⚠️ Les données personnelles et la CNI seront effacées définitivement. 
              <strong> Le registre financier (anonymisé) sera conservé à des fins de preuve.</strong>
            </div>
            <button className="btn btn-danger btn-sm" style={{ marginTop: 10 }}>🗑️ Supprimer les données personnelles</button>
          </div>

          <div style={{ marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            <a href="#" style={{ color: 'var(--indigo)', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>📄 Voir la politique de confidentialité</a>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 6 }}>Conforme au Code de la protection des données personnelles du Sénégal (CDP).</div>
          </div>

          <div style={{ marginTop: 20, borderTop: '1px solid var(--line)', paddingTop: 12, fontSize: 11, color: 'var(--ink-soft)', background: 'var(--cream)', padding: 10, borderRadius: 6 }}>
            ℹ️ En production, un coût fixe mensuel BSP s'applique (ex: ~49€/mois via 360dialog). Les coûts WhatsApp sont détaillés dans le widget de bord.
          </div>
        </div>
      )}
    </div>
  );
}

export default Confidentialite;