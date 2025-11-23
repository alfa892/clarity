import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, PlayCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import type { CCAMAct } from '../types';
import { InactionSimulator } from './InactionSimulator';
import { GoodBetterBest } from './GoodBetterBest';
import { SocialProof } from './SocialProof';

interface ResultPageProps {
    act: CCAMAct;
    onBack: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ act, onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-20 px-6 py-4 shadow-sm flex items-center justify-between">
                <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium text-sm">
                    ← Retour
                </button>
                <div className="flex items-center space-x-2">
                    <ShieldCheck size={18} className="text-health-500" />
                    <span className="font-bold text-slate-800">Analyse Terminée</span>
                </div>
                <div className="w-8" /> {/* Spacer */}
            </div>

            <div className="max-w-md mx-auto p-6 space-y-6">

                {/* Card 1: Translation (The Hook) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-soft border border-health-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 bg-health-100 text-health-700 text-xs font-bold px-3 py-1 rounded-bl-2xl">
                        Traduction
                    </div>
                    <div className="flex items-start mb-4">
                        <div className="w-12 h-12 bg-health-50 rounded-2xl flex items-center justify-center mr-4 shrink-0">
                            <span className="text-2xl">🦷</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{act.label_patient}</h2>
                            <p className="text-sm text-slate-500 font-mono">{act.code}</p>
                        </div>
                    </div>

                    <div className="bg-health-50/50 rounded-xl p-4 mb-4 border border-health-100/50">
                        <p className="text-health-800 font-medium leading-relaxed">
                            "{act.label_vibe || act.description}"
                        </p>
                    </div>

                    <button className="w-full py-3 bg-white border-2 border-health-100 text-health-700 rounded-xl font-semibold hover:bg-health-50 transition-colors flex items-center justify-center">
                        <PlayCircle size={20} className="mr-2" />
                        Voir la vidéo explicative
                    </button>
                </motion.div>

                {/* Card 2: Fair Price (The Reassurance) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-6 shadow-soft"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        Analyse du Prix
                        <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Région Province</span>
                    </h3>

                    <div className="relative h-4 bg-slate-100 rounded-full mb-2 overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-green-400 opacity-30"></div>
                        <div className="absolute left-1/3 top-0 h-full w-1/3 bg-green-500 opacity-50"></div>
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-orange-400 opacity-30"></div>

                        {/* Cursor */}
                        <div className="absolute top-0 bottom-0 w-1 bg-slate-900 left-1/2 transform -translate-x-1/2 z-10 shadow-lg"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mb-4 font-medium">
                        <span>Éco</span>
                        <span>Moyen</span>
                        <span>Premium</span>
                    </div>

                    <div className="flex items-start space-x-3">
                        <CheckCircle className="text-health-500 shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-slate-600 leading-relaxed">
                            <strong className="text-slate-900">Prix Juste.</strong> Ce devis est dans la moyenne constatée pour cet acte avec ce niveau de qualité.
                        </p>
                    </div>
                </motion.div>

                {/* Card 3: Reste à Charge (The Business) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                    <h3 className="text-sm font-medium text-slate-400 mb-1">Estimation Reste à Charge</h3>
                    <div className="text-4xl font-bold mb-2">
                        {((act.price_avg_province || 0) - (act.base_remboursement || 0)).toFixed(2)} €
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                        Base Sécu : {act.base_remboursement} € • Mutuelle : À vérifier
                    </p>

                    <button className="w-full py-3.5 bg-health-500 hover:bg-health-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-health-500/30 flex items-center justify-center animate-pulse-slow">
                        Réduire ce montant à 0€ ?
                        <ArrowRight size={18} className="ml-2" />
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-3">
                        Voir les mutuelles partenaires compatibles
                    </p>
                </motion.div>

                <InactionSimulator act={act} currentPrice={act.price_avg_province || 0} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                >
                    <GoodBetterBest acts={[act]} />
                    <SocialProof acts={[act]} />
                </motion.div>

            </div>
        </div>
    );
};
