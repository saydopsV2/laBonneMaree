import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNav: React.FC = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) => 
        `cursor-pointer flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant/20 px-4 pb-6 pt-3 flex justify-around items-center">
            <NavLink to="/" className={navLinkClass} end>
                {({ isActive }) => (
                    <>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>home</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/tide" className={navLinkClass}>
                {({ isActive }) => (
                    <>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>water</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Tide</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/ports" className={navLinkClass}>
                {({ isActive }) => (
                    <>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>anchor</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Ports</span>
                    </>
                )}
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
                {({ isActive }) => (
                    <>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}>settings</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
                    </>
                )}
            </NavLink>
        </nav>
    );
};
