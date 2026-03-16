import React from 'react';

export const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant/20 px-4 pb-6 pt-3 flex justify-around items-center">
            <a href="#" className="flex flex-col items-center gap-1 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
            </a>
            <a href="#" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">water</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Tide</span>
            </a>
            <a href="#" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">anchor</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Ports</span>
            </a>
            <a href="#" className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">settings</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
            </a>
        </nav>
    );
};
