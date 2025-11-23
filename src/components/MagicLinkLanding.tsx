import React from 'react';
import { ArrowLeft, CheckCircle2, Link2, MessageCircle, ShieldCheck, TimerReset, Wallet, Waves } from 'lucide-react';
import type { Quote } from '../types';
import { InactionSimulator } from './InactionSimulator';
import { GoodBetterBest } from './GoodBetterBest';
import { SocialProof } from './SocialProof';
import { FinancingWidget } from './FinancingWidget';

interface MagicLinkLandingProps {
    quote: Quote;
    onBack: () => void;
}

export const MagicLinkLanding: React.FC<MagicLinkLandingProps> = ({ quote, onBack }) => {
    const baseRemboursement = quote.acts.reduce((sum, act) => sum + (act.base_remboursement || 0), 0);
    const resteCharge = Math.max(0, quote.total - baseRemboursement);
    const monthly = Math.max(25, Math.ceil(resteCharge / 4));
    const expiry = quote.linkExpiresAt ? new Date(quote.linkExpiresAt) : null;
    const actForSimulator = quote.acts[0];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center">
                    <ArrowLeft size={18} className="mr-2" /> Retour
                </button>
                <div className="flex items-center space-x-2">
                    <ShieldCheck size={18} className="text-health-500" />
                    <span className="text-sm font-semibold text-slate-700">Accès sécurisé</span>
                </div>
                <div className="text-xs text-slate-400">klarity.app/d/{quote.magicLinkToken}</div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
                <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,#38a772,transparent_45%)]" />
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-sm text-white/70 uppercase font-semibold tracking-wide mb-2">Magic Link Patient</p>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Bonjour {quote.patientName}, voici votre plan.</h1>
                            <p className="text-white/80 text-lg max-w-2xl">
                                L’assistant IA du Dr Martin a traduit votre devis et préparé un parcours simple : explication, reste à charge et financement immédiat.
                            </p>
                            {expiry && (
                                <div className="mt-4 inline-flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-full text-sm font-semibold">
                                    <TimerReset size={16} />
                                    <span>Valide jusqu’au {expiry.toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                        <div className="bg-white/10 border border-white/15 rounded-2xl p-5 w-full md:w-72">
                            <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                                <span>Montant</span>
                                <span className="font-semibold text-white">{quote.total.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                                <span>Base Sécu</span>
                                <span className="font-semibold text-white">{baseRemboursement.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Reste à charge</span>
                                <span className="text-health-200">{resteCharge.toFixed(2)} €</span>
                            </div>
                            <button className="w-full mt-4 py-3 bg-health-500 hover:bg-health-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-health-500/40 transition-all">
                                Je valide ce plan
                            </button>
                            <p className="text-[11px] text-white/60 mt-2 text-center">Paiement sécurisé • Option 4x disponible</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-soft">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <CheckCircle2 size={18} className="text-health-500" />
                                <h3 className="font-bold text-slate-900">Vos actes</h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Traduction</span>
                        </div>
                        <div className="space-y-3">
                            {quote.acts.slice(0, 3).map((act) => (
                                <div key={act.code} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-slate-900">{act.label_patient}</p>
                                        <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{act.code}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{act.description}</p>
                                </div>
                            ))}
                            {quote.acts.length > 3 && (
                                <p className="text-xs text-slate-500">+{quote.acts.length - 3} autres actes dans le plan.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-soft">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <Wallet size={18} className="text-health-500" />
                                <h3 className="font-bold text-slate-900">Financement</h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Option 4x</span>
                        </div>
                        <p className="text-3xl font-extrabold text-slate-900 mb-1">{monthly} €/mois</p>
                        <p className="text-sm text-slate-500 mb-3">Sur 4 mensualités, sans avance de frais.</p>
                        <div className="bg-health-50 border border-health-100 rounded-xl p-3 text-sm text-health-800">
                            Validation immédiate en ligne. Aucune relance cabinet, tout est géré automatiquement.
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-soft">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <Link2 size={18} className="text-health-500" />
                                <h3 className="font-bold text-slate-900">Suivi</h3>
                            </div>
                            <span className="text-xs text-slate-400 font-semibold">Magic Link</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            Ce lien est unique et sécurisé. Il vous permet de revoir le plan, poser vos questions et confirmer le rendez-vous.
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <MessageCircle size={14} />
                            <span>Besoin d’éclaircissements ? L’IA du cabinet répond en moins d’une minute.</span>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <GoodBetterBest acts={quote.acts} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FinancingWidget resteCharge={resteCharge} />
                        <SocialProof acts={quote.acts} />
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {actForSimulator ? (
                            <InactionSimulator act={actForSimulator} currentPrice={actForSimulator.price_avg_province || 0} />
                        ) : (
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
                                Aucun acte détecté pour simuler l'inaction.
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft space-y-4">
                        <div className="flex items-center space-x-3">
                            <Waves size={20} className="text-health-500" />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">Pourquoi agir maintenant ?</p>
                                <p className="text-lg font-bold text-slate-900">Moins de douleur, moins de coûts</p>
                            </div>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li>• Les complications augmentent de +{(Math.max(...quote.acts.map(a => a.price_avg_province || 0)) || 200).toFixed(0)} € en moyenne.</li>
                            <li>• Les créneaux urgences coûtent plus cher et sont plus longs.</li>
                            <li>• Avec la validation en ligne, vous sécurisez le devis sans retour au cabinet.</li>
                        </ul>
                        <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl">Je bloque mon plan</button>
                    </div>
                </section>
            </main>
        </div>
    );
};
