import React from 'react';

export const Header: React.FC = () => (
    <header className="sticky top-0 z-50 bg-surface h-16 flex items-center px-6 border-b border-outline-variant/15">
        <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" data-icon="anchor">anchor</span>
            <h1 className="font-headline font-extrabold text-xl text-primary tracking-tight">La Bonne Maree</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant" data-icon="notifications">notifications</span>
            </button>
        </div>
    </header>
);