import React from 'react';
import { Scan, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
    onNavigate: (page: 'scan' | 'manual') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-health-50 to-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-health-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-medical-200/30 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-md w-full z-10"
            >
                <div className="mb-8 inline-flex items-center justify-center px-4 py-1.5 bg-white rounded-full shadow-sm border border-health-100">
                    <ShieldCheck size={16} className="text-health-500 mr-2" />
                    <span className="text-xs font-semibold text-health-700 tracking-wide uppercase">L'Assistant Dentaire Intelligent</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                    Comprenez votre devis en <span className="text-health-600">10 secondes</span>.
                </h1>

                <p className="text-lg text-slate-600 mb-12 leading-relaxed">
                    Scannez votre document pour obtenir une analyse claire, vérifier les prix et optimiser votre remboursement.
                </p>

                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('scan')}
                        className="w-full group relative overflow-hidden bg-health-600 hover:bg-health-500 text-white p-6 rounded-3xl shadow-xl shadow-health-500/20 transition-all duration-300 flex items-center justify-between"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-2xl font-bold mb-1">Scanner mon Devis</span>
                            <span className="text-health-100 text-sm font-medium">Caméra ou PDF • Analyse IA</span>
                        </div>
                        <div className="bg-white/20 p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                            <Scan size={32} className="text-white" />
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('manual')}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 p-5 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-all duration-200 flex items-center justify-center font-semibold"
                    >
                        <Search size={20} className="mr-2 text-slate-400" />
                        Recherche Manuelle
                    </motion.button>
                </div>

                <div className="mt-12 flex items-center justify-center space-x-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Mock Logos for Trust */}
                    <div className="h-6 w-20 bg-slate-300 rounded-md animate-pulse"></div>
                    <div className="h-6 w-20 bg-slate-300 rounded-md animate-pulse"></div>
                    <div className="h-6 w-20 bg-slate-300 rounded-md animate-pulse"></div>
                </div>
            </motion.div>
        </div>
    );
};
