import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getProjets, getPersonnel, createPersonnel, getEngins, createEngin,
    getSousTraitants, createSousTraitant, getPointages, createPointage,
    getPersonnelProjet, getEnginsProjet, affecterEngin,
    getSousTraitantsProjet, affecterSousTraitant,
} from '../../api/api';
import { Plus, X, HardHat, Truck, Briefcase, ClipboardCheck } from 'lucide-react';

const emptyPersonnel = { nom: '', prenom: '', poste: '', categorie: 'ouvrier_qualifie', typeContrat: 'journalier', tauxJournalier: '', salaireMensuel: '', telephone: '' };
const emptyEngin = { designation: '', immatriculation: '', marque: '', modele: '', type: 'propre', tauxJournalier: '' };
const emptySousTraitant = { nom: '', nomGerant: '', specialite: 'gros_oeuvre', region: '', telephone: '', email: '' };
const emptyPointage = { personnelId: '', date: new Date().toISOString().slice(0, 10), statut: 'present', heuresSupplementaires: '0', observations: '' };
const emptyAffEngin = { enginId: '', dateDebut: new Date().toISOString().slice(0, 10), dateFin: '', observations: '' };
const emptyAffST = { sousTraitantId: '', dateDebut: new Date().toISOString().slice(0, 10), dateFin: '', montantContrat: '', observations: '' };

const categorieLabels = { encadrement: 'Encadrement', ouvrier_qualifie: 'Ouvrier qualifié', manoeuvre: 'Manœuvre', tacheronnage: 'Tâcheronnage', saisonnier: 'Saisonnier' };
const contratLabels = { cdi: 'CDI', cdd: 'CDD', journalier: 'Journalier', tacheronnage: 'Tâcheronnage' };
const statutEnginBadge = { disponible: 'badge-green', en_service: 'badge-blue', en_maintenance: 'badge-amber', hors_service: 'badge-gray' };
const specialiteLabels = { electricite: 'Électricité', plomberie: 'Plomberie', menuiserie_alu: 'Menuiserie Alu', menuiserie_bois: 'Menuiserie Bois', peinture: 'Peinture', carrelage: 'Carrelage', etancheite: 'Étanchéité', vrd: 'VRD', terrassement: 'Terrassement', gros_oeuvre: 'Gros œuvre', autre: 'Autre' };
const statutPresenceLabels = { present: 'Présent', absent: 'Absent', demi_journee: 'Demi-journée', conge: 'Congé', maladie: 'Maladie' };
const statutPresenceBadge = { present: 'badge-green', absent: 'badge-gray', demi_journee: 'badge-amber', conge: 'badge-blue', maladie: 'badge-amber' };

export default function Ressources() {
    const [tab, setTab] = useState('personnel');
    const [projets, setProjets] = useState([]);
    const [projetId, setProjetId] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Global resource lists (for dropdowns in modals)
    const [allPersonnel, setAllPersonnel] = useState([]);
    const [allEngins, setAllEngins] = useState([]);
    const [allSousTraitants, setAllSousTraitants] = useState([]);

    // Project-specific data
    const [projetPersonnel, setProjetPersonnel] = useState([]);
    const [projetEngins, setProjetEngins] = useState([]);
    const [projetSousTraitants, setProjetSousTraitants] = useState([]);
    const [pointages, setPointages] = useState([]);
    const [loadingProjet, setLoadingProjet] = useState(false);

    // Forms
    const [formPersonnel, setFormPersonnel] = useState(emptyPersonnel);
    const [formEngin, setFormEngin] = useState(emptyEngin);
    const [formSousTraitant, setFormSousTraitant] = useState(emptySousTraitant);
    const [formPointage, setFormPointage] = useState(emptyPointage);
    const [formAffEngin, setFormAffEngin] = useState(emptyAffEngin);
    const [formAffST, setFormAffST] = useState(emptyAffST);

    // What kind of modal? 'add-global' or 'affecter'
    const [modalMode, setModalMode] = useState('affecter');

    useEffect(() => {
        setLoading(true);
        Promise.all([getProjets(), getPersonnel(), getEngins(), getSousTraitants()])
            .then(([proj, p, e, s]) => {
                setProjets(proj); setAllPersonnel(p); setAllEngins(e); setAllSousTraitants(s);
                if (proj.length > 0) setProjetId(proj[0].id);
            })
            .finally(() => setLoading(false));
    }, []);

    const loadProjetData = (pid) => {
        if (!pid) return;
        setLoadingProjet(true);
        Promise.all([getPersonnelProjet(pid), getEnginsProjet(pid), getSousTraitantsProjet(pid), getPointages(pid)])
            .then(([p, e, s, pt]) => { setProjetPersonnel(p); setProjetEngins(e); setProjetSousTraitants(s); setPointages(pt); })
            .finally(() => setLoadingProjet(false));
    };

    useEffect(() => { if (projetId) loadProjetData(projetId); }, [projetId]);

    const reloadGlobals = () => {
        Promise.all([getPersonnel(), getEngins(), getSousTraitants()])
            .then(([p, e, s]) => { setAllPersonnel(p); setAllEngins(e); setAllSousTraitants(s); });
    };

    const openModal = (mode) => { setModalMode(mode); setShowModal(true); };

    // ─── Handlers ───
    const handleAddPersonnel = async (e) => { e.preventDefault(); await createPersonnel({ ...formPersonnel, tauxJournalier: formPersonnel.tauxJournalier ? Number(formPersonnel.tauxJournalier) : undefined, salaireMensuel: formPersonnel.salaireMensuel ? Number(formPersonnel.salaireMensuel) : undefined }); setShowModal(false); setFormPersonnel(emptyPersonnel); reloadGlobals(); };
    const handleAddEngin = async (e) => { e.preventDefault(); await createEngin({ ...formEngin, tauxJournalier: formEngin.tauxJournalier ? Number(formEngin.tauxJournalier) : undefined }); setShowModal(false); setFormEngin(emptyEngin); reloadGlobals(); };
    const handleAddSousTraitant = async (e) => { e.preventDefault(); await createSousTraitant(formSousTraitant); setShowModal(false); setFormSousTraitant(emptySousTraitant); reloadGlobals(); };
    const handleAddPointage = async (e) => { e.preventDefault(); await createPointage(projetId, { ...formPointage, heuresSupplementaires: Number(formPointage.heuresSupplementaires) || 0 }); setShowModal(false); setFormPointage(emptyPointage); loadProjetData(projetId); };
    const handleAffecterEngin = async (e) => { e.preventDefault(); await affecterEngin(projetId, formAffEngin); setShowModal(false); setFormAffEngin(emptyAffEngin); loadProjetData(projetId); };
    const handleAffecterST = async (e) => { e.preventDefault(); await affecterSousTraitant(projetId, { ...formAffST, montantContrat: formAffST.montantContrat ? Number(formAffST.montantContrat) : undefined }); setShowModal(false); setFormAffST(emptyAffST); loadProjetData(projetId); };

    const formatFCFA = (n) => n ? `${Number(n).toLocaleString('fr-FR')} FCFA` : '—';
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

    if (loading) return <div className="spinner" />;
    if (projets.length === 0) return (
        <div>
            <div className="page-header"><div><h1>Ressources</h1></div></div>
            <div className="empty-state"><p>Aucun projet trouvé. Crée d'abord un projet.</p><button className="btn btn-primary" onClick={() => navigate('/projets')}>Aller aux projets</button></div>
        </div>
    );

    return (
        <div>
            {/* Header with project selector always visible */}
            <div className="page-header">
                <div>
                    <h1>Ressources</h1>
                    <p className="subtitle">Ressources affectées par projet</p>
                </div>
                <select className="form-select" style={{ maxWidth: 340 }} value={projetId} onChange={e => setProjetId(e.target.value)}>
                    {projets.map(p => <option key={p.id} value={p.id}>{p.reference} — {p.intitule}</option>)}
                </select>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <button className={`btn btn-sm ${tab === 'personnel' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('personnel')}><HardHat size={14} /> Personnel ({projetPersonnel.length})</button>
                <button className={`btn btn-sm ${tab === 'engins' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('engins')}><Truck size={14} /> Engins ({projetEngins.length})</button>
                <button className={`btn btn-sm ${tab === 'sous-traitants' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('sous-traitants')}><Briefcase size={14} /> Sous-traitants ({projetSousTraitants.length})</button>
                <button className={`btn btn-sm ${tab === 'pointages' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('pointages')}><ClipboardCheck size={14} /> Pointages ({pointages.length})</button>
            </div>

            {/* Action buttons */}
            <div className="page-header" style={{ marginBottom: 12 }}>
                <div />
                <div style={{ display: 'flex', gap: 8 }}>
                    {tab === 'personnel' && <button className="btn btn-primary" onClick={() => openModal('pointage')}><Plus size={16} /> Pointer un employé</button>}
                    {tab === 'engins' && <button className="btn btn-primary" onClick={() => openModal('affecter-engin')}><Plus size={16} /> Affecter un engin</button>}
                    {tab === 'sous-traitants' && <button className="btn btn-primary" onClick={() => openModal('affecter-st')}><Plus size={16} /> Affecter un sous-traitant</button>}
                    {tab === 'pointages' && <button className="btn btn-primary" onClick={() => openModal('pointage')}><Plus size={16} /> Pointage</button>}
                </div>
            </div>

            {/* Tables */}
            {loadingProjet ? <div className="spinner" /> : (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    {tab === 'personnel' && (
                        <table className="data-table">
                            <thead><tr><th>Nom</th><th>Poste</th><th>Catégorie</th><th>Contrat</th><th>Taux/Salaire</th><th>Téléphone</th></tr></thead>
                            <tbody>
                                {projetPersonnel.map(p => (
                                    <tr key={p.id}><td style={{ fontWeight: 600 }}>{p.prenom} {p.nom}</td><td>{p.poste}</td><td>{categorieLabels[p.categorie] || p.categorie}</td><td><span className="badge badge-teal">{contratLabels[p.typeContrat] || p.typeContrat}</span></td><td className="montant">{p.salaireMensuel ? `${formatFCFA(p.salaireMensuel)}/mois` : `${formatFCFA(p.tauxJournalier)}/jour`}</td><td>{p.telephone || '—'}</td></tr>
                                ))}
                                {projetPersonnel.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Aucun employé affecté à ce projet. Utilisez "Pointer un employé" pour en ajouter.</td></tr>}
                            </tbody>
                        </table>
                    )}
                    {tab === 'engins' && (
                        <table className="data-table">
                            <thead><tr><th>Désignation</th><th>Immatriculation</th><th>Type</th><th>Date début</th><th>Date fin</th><th>Observations</th></tr></thead>
                            <tbody>
                                {projetEngins.map(a => (
                                    <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.engin?.designation}</td><td>{a.engin?.immatriculation || '—'}</td><td style={{ textTransform: 'capitalize' }}>{a.engin?.type}</td><td>{formatDate(a.dateDebut)}</td><td>{formatDate(a.dateFin)}</td><td>{a.observations || '—'}</td></tr>
                                ))}
                                {projetEngins.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Aucun engin affecté à ce projet</td></tr>}
                            </tbody>
                        </table>
                    )}
                    {tab === 'sous-traitants' && (
                        <table className="data-table">
                            <thead><tr><th>Raison sociale</th><th>Spécialité</th><th>Montant contrat</th><th>Date début</th><th>Date fin</th><th>Observations</th></tr></thead>
                            <tbody>
                                {projetSousTraitants.map(a => (
                                    <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.sousTraitant?.nom}</td><td><span className="badge badge-teal">{specialiteLabels[a.sousTraitant?.specialite] || a.sousTraitant?.specialite}</span></td><td className="montant">{formatFCFA(a.montantContrat)}</td><td>{formatDate(a.dateDebut)}</td><td>{formatDate(a.dateFin)}</td><td>{a.observations || '—'}</td></tr>
                                ))}
                                {projetSousTraitants.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Aucun sous-traitant affecté à ce projet</td></tr>}
                            </tbody>
                        </table>
                    )}
                    {tab === 'pointages' && (
                        <table className="data-table">
                            <thead><tr><th>Employé</th><th>Date</th><th>Statut</th><th>Heures sup.</th><th>Montant</th><th>Observations</th></tr></thead>
                            <tbody>
                                {pointages.map(pt => (
                                    <tr key={pt.id}><td style={{ fontWeight: 600 }}>{pt.personnel ? `${pt.personnel.prenom} ${pt.personnel.nom}` : '—'}</td><td>{formatDate(pt.date)}</td><td><span className={`badge ${statutPresenceBadge[pt.statut] || 'badge-gray'}`}>{statutPresenceLabels[pt.statut] || pt.statut}</span></td><td>{pt.heuresSupplementaires || 0}h</td><td className="montant">{formatFCFA(pt.montantJournalier)}</td><td>{pt.observations || '—'}</td></tr>
                                ))}
                                {pointages.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Aucun pointage pour ce projet</td></tr>}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ─── Modal: Pointage ─── */}
            {showModal && modalMode === 'pointage' && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Nouveau pointage</h2><button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button></div>
                        <form onSubmit={handleAddPointage}>
                            <div className="form-group"><label>Employé *</label><select className="form-select" required value={formPointage.personnelId} onChange={e => setFormPointage({ ...formPointage, personnelId: e.target.value })}><option value="">— Sélectionner —</option>{allPersonnel.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom} — {p.poste}</option>)}</select></div>
                            <div className="form-row">
                                <div className="form-group"><label>Date *</label><input className="form-input" type="date" required value={formPointage.date} onChange={e => setFormPointage({ ...formPointage, date: e.target.value })} /></div>
                                <div className="form-group"><label>Statut *</label><select className="form-select" value={formPointage.statut} onChange={e => setFormPointage({ ...formPointage, statut: e.target.value })}>{Object.entries(statutPresenceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                            </div>
                            <div className="form-group"><label>Heures supplémentaires</label><input className="form-input" type="number" min="0" step="0.5" value={formPointage.heuresSupplementaires} onChange={e => setFormPointage({ ...formPointage, heuresSupplementaires: e.target.value })} /></div>
                            <div className="form-group"><label>Observations</label><input className="form-input" value={formPointage.observations} onChange={e => setFormPointage({ ...formPointage, observations: e.target.value })} /></div>
                            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button><button type="submit" className="btn btn-primary"><Plus size={16} /> Ajouter</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Modal: Affecter Engin ─── */}
            {showModal && modalMode === 'affecter-engin' && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Affecter un engin</h2><button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button></div>
                        <form onSubmit={handleAffecterEngin}>
                            <div className="form-group"><label>Engin *</label><select className="form-select" required value={formAffEngin.enginId} onChange={e => setFormAffEngin({ ...formAffEngin, enginId: e.target.value })}><option value="">— Sélectionner —</option>{allEngins.map(e => <option key={e.id} value={e.id}>{e.designation} {e.immatriculation ? `(${e.immatriculation})` : ''}</option>)}</select></div>
                            <div className="form-row">
                                <div className="form-group"><label>Date début *</label><input className="form-input" type="date" required value={formAffEngin.dateDebut} onChange={e => setFormAffEngin({ ...formAffEngin, dateDebut: e.target.value })} /></div>
                                <div className="form-group"><label>Date fin</label><input className="form-input" type="date" value={formAffEngin.dateFin} onChange={e => setFormAffEngin({ ...formAffEngin, dateFin: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Observations</label><input className="form-input" value={formAffEngin.observations} onChange={e => setFormAffEngin({ ...formAffEngin, observations: e.target.value })} /></div>
                            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button><button type="submit" className="btn btn-primary"><Plus size={16} /> Affecter</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Modal: Affecter Sous-traitant ─── */}
            {showModal && modalMode === 'affecter-st' && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Affecter un sous-traitant</h2><button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button></div>
                        <form onSubmit={handleAffecterST}>
                            <div className="form-group"><label>Sous-traitant *</label><select className="form-select" required value={formAffST.sousTraitantId} onChange={e => setFormAffST({ ...formAffST, sousTraitantId: e.target.value })}><option value="">— Sélectionner —</option>{allSousTraitants.map(s => <option key={s.id} value={s.id}>{s.nom} — {specialiteLabels[s.specialite] || s.specialite}</option>)}</select></div>
                            <div className="form-row">
                                <div className="form-group"><label>Date début *</label><input className="form-input" type="date" required value={formAffST.dateDebut} onChange={e => setFormAffST({ ...formAffST, dateDebut: e.target.value })} /></div>
                                <div className="form-group"><label>Date fin</label><input className="form-input" type="date" value={formAffST.dateFin} onChange={e => setFormAffST({ ...formAffST, dateFin: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label>Montant contrat (FCFA)</label><input className="form-input" type="number" value={formAffST.montantContrat} onChange={e => setFormAffST({ ...formAffST, montantContrat: e.target.value })} /></div>
                            <div className="form-group"><label>Observations</label><input className="form-input" value={formAffST.observations} onChange={e => setFormAffST({ ...formAffST, observations: e.target.value })} /></div>
                            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button><button type="submit" className="btn btn-primary"><Plus size={16} /> Affecter</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}