import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import type { CCAMAct } from '../types';
import { getReviewsForActs } from '../data/social_proof';

interface SocialProofProps {
    acts: CCAMAct[];
}

export const SocialProof: React.FC<SocialProofProps> = ({ acts }) => {
    const list = getReviewsForActs(acts);
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <MessageSquare size={18} className="text-health-500" />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">Preuve sociale</p>
                        <p className="text-lg font-bold text-slate-900">Ils ont fait le même soin</p>
                    </div>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Sélection auto</span>
            </div>

            <div className="space-y-3">
                {list.map(review => (
                    <div key={review.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70">
                        <div className="flex items-center justify-between mb-1">
                            <div className="font-semibold text-slate-900">{review.name}</div>
                            <div className="flex items-center space-x-1 text-amber-500">
                                {Array.from({ length: review.rating }).map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{review.city} • {review.tags.join(', ')}</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{review.snippet}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
