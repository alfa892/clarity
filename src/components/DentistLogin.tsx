import React, { useState } from 'react';
import { Lock, Mail, Shield, User } from 'lucide-react';
import type { DentistUser } from '../types';

interface DentistLoginProps {
    onLogin: (user: DentistUser) => void;
    onCancel: () => void;
}

export const DentistLogin: React.FC<DentistLoginProps> = ({ onLogin, onCancel }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<DentistUser['role']>('titulaire');
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name || !code) {
            alert('Complétez les champs pour sécuriser l’accès.');
            return;
        }
        const newUser: DentistUser = {
            id: crypto.randomUUID(),
            email,
            name,
            role,
        };
        onLogin(newUser);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft border border-slate-100 p-8 space-y-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                        <Shield size={24} />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">Accès praticien</p>
                        <h1 className="text-2xl font-extrabold text-slate-900">Cockpit sécurisé</h1>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 flex items-center">
                            <User size={16} className="mr-2 text-slate-400" /> Nom
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Dr Martin"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 flex items-center">
                            <Mail size={16} className="mr-2 text-slate-400" /> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="dr.martin@cabinet.fr"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1">Rôle</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['titulaire', 'collaborateur', 'assistante'] as DentistUser['role'][]).map((r) => (
                                <button
                                    type="button"
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${role === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 flex items-center">
                            <Lock size={16} className="mr-2 text-slate-400" /> Code SMS (mock)
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="123-456"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-health-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-400 mt-1">Démonstration sans backend : le code est libre.</p>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50"
                        >
                            Retour
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-health-600 hover:bg-health-500 text-white font-bold rounded-xl shadow-lg shadow-health-500/30"
                        >
                            Se connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
