import React, { useState, useMemo } from 'react';
import { ArrowLeft, Link, Plus, Trash2, Calculator, Search, Mail, MessageCircle, Smartphone, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CCAMAct, Quote } from '../types';
import { ccamData } from '../data/ccam_codes';

interface DentistQuoteEditorProps {
    onBack: () => void;
    onSave: (quote: Quote) => void;
}

export const DentistQuoteEditor: React.FC<DentistQuoteEditorProps> = ({ onBack, onSave }) => {
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [selectedActs, setSelectedActs] = useState<CCAMAct[]>([]);
    const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [deliveryChannels, setDeliveryChannels] = useState<string[]>(['email', 'sms']);

    const filteredActs = useMemo(() => {
        if (!searchTerm) return [];
        const lowerTerm = searchTerm.toLowerCase();
        return ccamData.filter(act =>
            act.code.toLowerCase().includes(lowerTerm) ||
            act.label_patient.toLowerCase().includes(lowerTerm)
        ).slice(0, 5);
    }, [searchTerm]);

    const handleAddAct = (act: CCAMAct) => {
        setSelectedActs(prev => [...prev, act]);
        setSearchTerm('');
        // Initialize custom price with average price or base reimbursement if not set
        if (!customPrices[act.code]) {
            setCustomPrices(prev => ({
                ...prev,
                [act.code]: act.price_avg_province || act.base_remboursement || 0
            }));
        }
    };

    const handleRemoveAct = (index: number) => {
        setSelectedActs(prev => prev.filter((_, i) => i !== index));
        // Optional: cleanup custom price if no other instance of this act exists
    };

    const handlePriceChange = (code: string, price: number) => {
        setCustomPrices(prev => ({ ...prev, [code]: price }));
    };

    const calculateTotal = () => {
        return selectedActs.reduce((sum, act) => {
            const base = act.price_avg_province || act.base_remboursement || 0;
            const applied = customPrices[act.code] ?? base;
            return sum + applied;
        }, 0);
    };

    const toggleChannel = (channel: string) => {
        setDeliveryChannels(prev => prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]);
    };

    const handleSave = () => {
        if (!patientName) return alert('Veuillez entrer un nom de patient');
        if (deliveryChannels.length === 0) return alert('Choisissez au moins un canal d’envoi (SMS / Email / WhatsApp).');
        if (selectedActs.length === 0) return alert('Veuillez ajouter au moins un acte');

        const newQuote: Quote = {
            id: Math.random().toString(36).substr(2, 9),
            patientName,
            patientEmail,
            date: new Date().toISOString(),
            status: 'sent',
            acts: selectedActs,
            customPrices,
            total: calculateTotal(),
            deliveryChannels,
            linkExpiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        };
        onSave(newQuote);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900">Nouveau Devis</h1>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="text-right mr-4">
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Devis</div>
                        <div className="text-2xl font-bold text-slate-900">{calculateTotal().toFixed(2)} €</div>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-health-600 hover:bg-health-500 text-white rounded-xl font-bold shadow-lg shadow-health-500/20 flex items-center transition-all"
                    >
                        <Link size={18} className="mr-2" />
                        Générer Magic Link
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Patient Info & Search */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Patient</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Nom Prénom"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:border-transparent outline-none transition-all"
                            />
                            <div className="relative">
                                <input
                                    type="email"
                                    value={patientEmail}
                                    onChange={(e) => setPatientEmail(e.target.value)}
                                    placeholder="Email (pour le lien)"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:border-transparent outline-none transition-all"
                                />
                                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Plus size={20} className="mr-2 text-health-500" />
                            Ajouter un acte
                        </h2>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher un code (ex: HBLD038) ou un nom..."
                                className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:border-transparent outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        </div>

                        {/* Search Results Dropdown */}
                        {filteredActs.length > 0 && (
                            <div className="mt-2 bg-white border border-slate-100 rounded-xl shadow-lg divide-y divide-slate-50 overflow-hidden">
                                {filteredActs.map(act => (
                                    <button
                                        key={act.code}
                                        onClick={() => handleAddAct(act)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex justify-between items-center group"
                                    >
                                        <div>
                                            <div className="font-medium text-slate-900">{act.label_patient}</div>
                                            <div className="text-xs text-slate-400 font-mono">{act.code}</div>
                                        </div>
                                        <div className="text-health-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm">
                                            Ajouter +
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Acts List */}
                    <div className="space-y-4">
                        {selectedActs.map((act, index) => (
                            <motion.div
                                key={`${act.code}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                        <span className="font-bold text-slate-900 mr-2">{act.label_patient}</span>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">{act.code}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">{act.label_technical}</p>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="flex flex-col items-end">
                                        <label className="text-xs text-slate-400 font-medium mb-1">Prix Appliqué (€)</label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={customPrices[act.code]}
                                                onChange={(e) => handlePriceChange(act.code, parseFloat(e.target.value) || 0)}
                                                className="w-24 px-3 py-2 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-health-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Fair Price Indicator */}
                                    <div className="flex flex-col items-center w-16">
                                        <div className="text-[10px] text-slate-400 font-medium mb-1">Analyse</div>
                                        <div className={`w-3 h-3 rounded-full ${(customPrices[act.code] || 0) > (act.price_avg_province || 0) * 1.2 ? 'bg-orange-400' :
                                            (customPrices[act.code] || 0) < (act.price_avg_province || 0) * 0.8 ? 'bg-green-400' : 'bg-green-500'
                                            }`} title="Indicateur de prix (Vert = Juste, Orange = Élevé)"></div>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveAct(index)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {selectedActs.length === 0 && (
                            <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                                Aucun acte ajouté. Utilisez la recherche ci-dessus.
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Shield size={18} className="mr-2 text-health-500" />
                            Canaux d'envoi sécurisés
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => toggleChannel('email')}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border ${deliveryChannels.includes('email') ? 'border-health-500 bg-health-50 text-health-700' : 'border-slate-200 bg-slate-50 text-slate-600'} transition-all`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Mail size={16} />
                                    <span>Email</span>
                                </div>
                                <span className="text-xs">{deliveryChannels.includes('email') ? '✔' : ''}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleChannel('sms')}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border ${deliveryChannels.includes('sms') ? 'border-health-500 bg-health-50 text-health-700' : 'border-slate-200 bg-slate-50 text-slate-600'} transition-all`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Smartphone size={16} />
                                    <span>SMS</span>
                                </div>
                                <span className="text-xs">{deliveryChannels.includes('sms') ? '✔' : ''}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleChannel('whatsapp')}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl border ${deliveryChannels.includes('whatsapp') ? 'border-health-500 bg-health-50 text-health-700' : 'border-slate-200 bg-slate-50 text-slate-600'} transition-all`}
                            >
                                <div className="flex items-center space-x-2">
                                    <MessageCircle size={16} />
                                    <span>WhatsApp</span>
                                </div>
                                <span className="text-xs">{deliveryChannels.includes('whatsapp') ? '✔' : ''}</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Chaque canal déclenchera un Magic Link unique avec tracking d'ouverture.</p>
                    </div>
                </div>

                {/* Right Column: Summary & Preview */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl sticky top-24">
                        <h3 className="text-lg font-bold mb-6 flex items-center">
                            <Calculator size={20} className="mr-2 text-health-400" />
                            Récapitulatif
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-300">
                                <span>Actes ({selectedActs.length})</span>
                                <span>{calculateTotal().toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Base Sécu</span>
                                <span>{selectedActs.reduce((sum, act) => sum + (act.base_remboursement || 0), 0).toFixed(2)} €</span>
                            </div>
                            <div className="h-px bg-white/10 my-4"></div>
                            <div className="flex justify-between text-xl font-bold">
                                <span>Reste à Charge</span>
                                <span className="text-health-400">
                                    {(calculateTotal() - selectedActs.reduce((sum, act) => sum + (act.base_remboursement || 0), 0)).toFixed(2)} €
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 text-right mt-1">*Avant mutuelle</div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-4 mb-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aperçu Patient</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Le patient verra une analyse détaillée de ces {selectedActs.length} actes, avec les labels "Vibe" et l'explication des remboursements.
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <Link size={16} className="text-health-300" />
                                    <span className="text-sm font-semibold">Magic Link</span>
                                </div>
                                <span className="text-[11px] text-white/70">Expire J+15</span>
                            </div>
                            <p className="text-sm text-white/80">Un lien unique sera généré et envoyé via {deliveryChannels.join(', ')}.</p>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-health-500 hover:bg-health-400 text-white rounded-xl font-bold shadow-lg shadow-health-500/20 transition-all flex items-center justify-center"
                        >
                            <Link size={20} className="mr-2" />
                            Créer le Magic Link
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
