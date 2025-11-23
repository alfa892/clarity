import React, { useMemo } from 'react';
import { Plus, FileText, CheckCircle, Clock, Search, Link as LinkIcon, Eye, Copy, Power, BarChart3 } from 'lucide-react';
import type { DentistUser, Quote } from '../types';

interface DashboardPageProps {
    user: DentistUser;
    onNavigate: (page: 'editor' | 'home') => void;
    quotes: Quote[];
    onOpenMagicLink: (quoteId: string) => void;
    onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onNavigate, quotes, onOpenMagicLink, onLogout }) => {
    const stats = useMemo(() => {
        const accepted = quotes.filter(q => q.status === 'accepted').length;
        const acceptanceRate = quotes.length ? Math.round((accepted / quotes.length) * 100) : 0;
        const total = quotes.reduce((sum, q) => sum + (q.total || 0), 0);
        const pending = quotes.filter(q => q.status !== 'accepted').reduce((sum, q) => sum + (q.total || 0), 0);
        const openEvents = quotes.reduce((sum, q) => sum + (q.openCount || 0), 0);
        return { acceptanceRate, total, pending, openEvents };
    }, [quotes]);

    const copyLink = (link?: string) => {
        if (!link) {
            alert('Aucun lien généré pour ce devis.');
            return;
        }
        navigator.clipboard?.writeText(link).then(() => {
            alert('Lien copié dans le presse-papier.');
        }).catch(() => {
            alert('Impossible de copier le lien.');
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Bonjour, {user.name} 👋</h1>
                    <p className="text-slate-500">Voici l'activité de votre cabinet aujourd'hui.</p>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium"
                    >
                        Retour Site Patient
                    </button>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium inline-flex items-center"
                    >
                        <Power size={18} className="mr-2" />
                        Déconnexion
                    </button>
                    <button
                        onClick={() => onNavigate('editor')}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg flex items-center transition-all"
                    >
                        <Plus size={20} className="mr-2" />
                        Nouveau Devis
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-medium mb-2">Devis ce mois</div>
                    <div className="text-3xl font-bold text-slate-900">{quotes.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-medium mb-2">Taux d'acceptation</div>
                    <div className="text-3xl font-bold text-health-600">{stats.acceptanceRate}%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-medium mb-2">CA potentiel en attente</div>
                    <div className="text-3xl font-bold text-slate-900">{stats.pending.toFixed(0)} €</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="text-slate-400 text-sm font-medium mb-1">Ouvertures Magic Links</div>
                        <div className="text-2xl font-bold text-slate-900">{stats.openEvents}</div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                        <BarChart3 size={18} />
                    </div>
                </div>
            </div>

            {/* Recent Quotes List */}
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Devis Récents</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un patient..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 text-left">Patient</th>
                            <th className="px-6 py-4 text-left">Date</th>
                            <th className="px-6 py-4 text-left">Actes</th>
                            <th className="px-6 py-4 text-left">Montant</th>
                            <th className="px-6 py-4 text-left">Statut</th>
                            <th className="px-6 py-4 text-left">Magic Link</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {quotes.length > 0 ? quotes.map((quote) => (
                            <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{quote.patientName}</td>
                                <td className="px-6 py-4 text-slate-500">{new Date(quote.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-slate-500">
                                    {quote.acts.length} acte{quote.acts.length > 1 ? 's' : ''}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{quote.total.toFixed(2)} €</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                                'bg-slate-100 text-slate-800'}`}>
                                        {quote.status === 'accepted' && <CheckCircle size={12} className="mr-1" />}
                                        {quote.status === 'sent' && <FileText size={12} className="mr-1" />}
                                        {quote.status === 'draft' && <Clock size={12} className="mr-1" />}
                                        {quote.status === 'accepted' ? 'Accepté' : quote.status === 'sent' ? 'Envoyé' : 'Brouillon'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900 flex items-center space-x-2">
                                        <LinkIcon size={16} className="text-health-500" />
                                        <span className="truncate max-w-[200px]">{quote.magicLinkUrl || 'Non généré'}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Ouvertures : {quote.openCount ?? 0} {quote.lastOpenedAt ? `• Vu le ${new Date(quote.lastOpenedAt).toLocaleDateString()}` : ''}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => copyLink(quote.magicLinkUrl)}
                                            className="text-slate-400 hover:text-slate-600 font-medium text-sm inline-flex items-center"
                                        >
                                            <Copy size={14} className="mr-1" /> Copier
                                        </button>
                                        <button
                                            onClick={() => onOpenMagicLink(quote.id)}
                                            className="text-health-600 hover:text-health-700 font-semibold text-sm inline-flex items-center"
                                        >
                                            <Eye size={14} className="mr-1" /> Ouvrir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    Aucun devis pour le moment. Créez votre premier devis !
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
