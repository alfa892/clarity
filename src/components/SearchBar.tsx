import React from 'react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Rechercher un code (ex: HBLD038) ou un mot-clé (ex: couronne)..."
                    className="w-full px-6 py-4 text-lg rounded-full border-2 border-medical-100 focus:border-medical-500 focus:outline-none shadow-sm text-slate-700 placeholder-slate-400 transition-colors"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-medical-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
