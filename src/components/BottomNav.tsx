import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to determine if a path is active
    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant/20 px-4 pb-6 pt-3 flex justify-around items-center">
            <button 
                onClick={() => navigate('/')}
                className={`cursor-pointer flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : undefined }}>home</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
            </button>
            <button 
                onClick={() => navigate('/tide')}
                className={`cursor-pointer flex flex-col items-center gap-1 ${isActive('/tide') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/tide') ? "'FILL' 1" : undefined }}>water</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Tide</span>
            </button>
            <button 
                onClick={() => navigate('/ports')}
                className={`cursor-pointer flex flex-col items-center gap-1 ${isActive('/ports') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/ports') ? "'FILL' 1" : undefined }}>anchor</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Ports</span>
            </button>
            <button 
                onClick={() => navigate('/settings')}
                className={`cursor-pointer flex flex-col items-center gap-1 ${isActive('/settings') ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/settings') ? "'FILL' 1" : undefined }}>settings</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
            </button>
        </nav>
    );
};
