export interface CCAMAct {
    code: string;
    label_technical: string;
    label_patient: string;
    label_vibe?: string; // Le libellé "Expert" rassurant
    description: string;
    category: 'soin' | 'prothese' | 'chirurgie' | 'implantologie' | 'orthodontie' | 'parodontologie' | 'prevention' | 'esthetique' | 'autre';
    price_min?: number;
    price_max?: number;
    price_avg_province?: number;
    price_avg_paris?: number;
    reimbursable: boolean;
    base_remboursement?: number;
    video_url?: string; // Lien vers une vidéo explicative
    keywords: string[];
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted';

export interface Quote {
    id: string;
    patientName: string;
    patientEmail?: string;
    date: string;
    status: QuoteStatus;
    acts: CCAMAct[];
    customPrices: Record<string, number>; // code -> price
    total: number;
    magicLinkToken?: string;
    magicLinkUrl?: string;
    linkExpiresAt?: string;
    openCount?: number;
    lastOpenedAt?: string | null;
    deliveryChannels?: string[];
}

export interface DentistUser {
    id: string;
    name: string;
    email: string;
    role: 'titulaire' | 'collaborateur' | 'assistante';
}
