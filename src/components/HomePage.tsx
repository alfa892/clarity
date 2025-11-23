import React from 'react';
import { Scan, Search, ShieldCheck, Stethoscope, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
    onNavigate: (page: 'scan' | 'manual' | 'login') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Brand */}
            <header className="relative z-10 pt-8 px-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200 mb-6">
                    <Sparkles size={14} className="text-health-500 mr-2" />
                    <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">Clarity Health</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    La transparence <br className="md:hidden" /> au service de la confiance.
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    La plateforme qui réunit patients et praticiens autour d'une compréhension claire des soins dentaires.
                </p>
            </header>

            {/* Main Portal Content */}
            <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">

                    {/* Patient Portal */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-health-200 transition-all duration-300 flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck size={120} className="text-health-500" />
                        </div>

                        <div className="mb-auto relative">
                            <div className="w-14 h-14 bg-health-50 rounded-2xl flex items-center justify-center mb-6 text-health-600">
                                <ShieldCheck size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Espace Patient</h2>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                Analysez votre devis dentaire en quelques secondes. Comprenez vos soins, vérifiez les prix et anticipez votre reste à charge.
                            </p>
                        </div>

                        <div className="space-y-3 relative">
                            <button
                                onClick={() => onNavigate('scan')}
                                className="w-full py-4 bg-health-600 hover:bg-health-500 text-white rounded-xl font-bold shadow-lg shadow-health-500/20 flex items-center justify-center transition-all group-hover:scale-[1.02]"
                            >
                                <Scan size={20} className="mr-2" />
                                Scanner mon Devis
                            </button>
                            <button
                                onClick={() => onNavigate('manual')}
                                className="w-full py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold flex items-center justify-center transition-colors"
                            >
                                <Search size={20} className="mr-2" />
                                Recherche Manuelle
                            </button>
                        </div>
                    </motion.div>

                    {/* Dentist Portal */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group relative bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/20 border border-slate-800 flex flex-col overflow-hidden"
                    >
                        {/* Abstract shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="mb-auto relative z-10">
                            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                                <Stethoscope size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Espace Praticien</h2>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                Le cockpit pour booster votre acceptation de devis. Créez des Magic Links, suivez vos patients et simplifiez vos explications.
                            </p>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <button
                                onClick={() => onNavigate('login')}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-all group-hover:scale-[1.02]"
                            >
                                Accéder au Cockpit
                                <ArrowRight size={20} className="ml-2" />
                            </button>
                            <div className="mt-4 text-center">
                                <span className="text-xs text-slate-500 font-medium">Accès sécurisé réservé aux professionnels</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>

            <footer className="py-6 text-center text-slate-400 text-sm relative z-10">
                © {new Date().getFullYear()} Clarity Health. Tous droits réservés.
            </footer>
        </div>
    );
};
