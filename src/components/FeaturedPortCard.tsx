import React from 'react';
import { PortTimerBadge } from './PortTimerBadge';
import { usePortContext } from '../context/PortContext';

export const FeaturedPortCard: React.FC = () => {
    const { selectedPort } = usePortContext();

    return (
        <div className="md:col-span-8 group relative overflow-hidden rounded-xl bg-primary text-on-primary p-8 flex flex-col justify-between aspect-[16/10] md:aspect-auto">
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                data-alt="Aerial view of a coastal marina with boats" 
                style={{ 
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqd4Lmza7C_8XzbZiykTloXd-3qIWzEM0uxo7PP9Pb348Xzd8hmQ5_8TC7sduD4ZIAE5_4VpNx3U-lgP0U-PJcb9GD4uGWlNEBupyS_q8PpCqDGVnxKwbwbdzod9-vFucv-gAmvwlZ5gRudwcy-o5s_jpxfn9bULXFbmRA_jhWBOluabPN3z7sPcFVSonfj14qzKIP0IWL_eo7raprV95erw9oRs_r_DbGBT1ksp90MYwHTqKTmqtcWI__7JU95bKW_MtWARQdkps')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            ></div>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <span className="bg-secondary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter mb-2 inline-block">Favori</span>
                    <h3 className="font-headline text-3xl font-bold">Port d'Arcachon</h3>
                    <p className="font-label text-sm opacity-80 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        43.2727° N, 6.6385° E
                    </p>
                </div>
                <div className="text-right">
                    <span className="font-headline text-5xl font-extrabold tracking-tighter">4.2m</span>
                    <p className="font-label text-xs uppercase tracking-widest opacity-60">Pleine mer</p>
                </div>
            </div>
            <div className="relative z-10 mt-auto flex items-end justify-between gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-on-tertiary-container bg-tertiary-container/30 px-3 py-1.5 rounded-full w-fit">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Marée Montante</span>
                    </div>
                    <p className="text-sm opacity-70">Prochaine basse mer à 18:42</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    {selectedPort && <PortTimerBadge port={selectedPort} size="medium" />}
                    <button className="bg-surface-container-lowest text-primary p-3 rounded-lg shadow-xl hover:scale-105 transition-transform cursor-pointer">
                        <span className="material-symbols-outlined">arrow_forward_ios</span>
                    </button>
                </div>
            </div>
        </div>
    );
};