import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ScanLine, FileText, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { analyzeQuoteImage, mapAnalyzedToCCAM } from '../services/openai';

interface ScanPageProps {
    onScanComplete: (results: any) => void;
    onCancel: () => void;
}

export const ScanPage: React.FC<ScanPageProps> = ({ onScanComplete, onCancel }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const startScan = async () => {
        if (!file) return;
        setIsScanning(true);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;
                try {
                    const analyzedActs = await analyzeQuoteImage(base64);
                    const mappedActs = mapAnalyzedToCCAM(analyzedActs);

                    if (mappedActs.length === 0) {
                        alert("Aucun acte détecté. Essayez une image plus nette.");
                        setIsScanning(false);
                        return;
                    }

                    onScanComplete(mappedActs);
                } catch (error) {
                    console.error(error);
                    alert("Analyse IA échouée. Passage en mode manuel.");
                    setIsScanning(false);
                    // Fallback: Redirect to manual search
                    onCancel(); // This goes back to home, user can click manual. Or we could add onManualRedirect prop.
                }
            };
        } catch (e) {
            console.error(e);
            setIsScanning(false);
            alert("Erreur lors du chargement de l'image.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Scanner votre Devis</h2>
                <p className="text-slate-500">
                    Importez une photo ou un PDF. Notre IA va analyser le document pour extraire les codes CCAM.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                                "border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer",
                                isDragging
                                    ? "border-medical-500 bg-medical-50 scale-[1.02]"
                                    : "border-slate-200 hover:border-medical-300 hover:bg-slate-50"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileSelect}
                            />
                            <div className="w-20 h-20 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Upload size={32} className="text-medical-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                Glissez-déposez votre devis ici
                            </h3>
                            <p className="text-slate-500 mb-6">
                                ou cliquez pour parcourir vos fichiers
                            </p>
                            <div className="flex justify-center gap-4 text-xs text-slate-400 uppercase tracking-wide font-medium">
                                <span>JPG</span>
                                <span>PNG</span>
                                <span>PDF</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            {!isScanning ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                                        <FileText size={40} className="text-slate-400" />
                                        <button
                                            onClick={() => setFile(null)}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-100 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{file.name}</h3>
                                    <p className="text-slate-500 mb-8">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <button
                                        onClick={startScan}
                                        className="px-8 py-4 bg-medical-600 text-white rounded-xl font-bold text-lg shadow-glow hover:bg-medical-500 transition-all flex items-center justify-center mx-auto"
                                    >
                                        <ScanLine size={24} className="mr-3" />
                                        Lancer l'analyse
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-20 relative">
                                    {/* Scanning Animation Effect */}
                                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
                                        <motion.div
                                            animate={{ top: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 w-full h-1 bg-medical-500 shadow-[0_0_20px_rgba(0,102,255,0.5)] z-10"
                                        />
                                        <div className="absolute inset-0 bg-medical-500/5" />
                                    </div>

                                    <div className="relative z-20">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                                            <Loader2 size={40} className="text-medical-600 animate-spin" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyse en cours...</h3>
                                        <p className="text-slate-500 animate-pulse">
                                            Extraction des codes CCAM et vérification des tarifs
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
