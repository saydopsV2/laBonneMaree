export const TideInstrument = () => (
    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
        <div>
            <span className="font-label text-xs font-bold uppercase tracking-widest text-outline mb-6 block">Current Conditions</span>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-headline text-5xl font-extrabold text-primary">4.2m</h3>
                    <p className="text-sm font-medium text-on-surface-variant mt-1">Current Tide Height</p>
                </div>
                <span className="material-symbols-outlined text-4xl text-on-tertiary-container">water</span>
            </div>
            <div className="space-y-6">
                <div className="h-32 w-full bg-surface-container-highest rounded-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-tertiary-container to-on-tertiary-container opacity-40" style={{ height: "65%" }}></div>
                    <div className="absolute bottom-[65%] left-0 w-full border-t-2 border-dashed border-on-tertiary-container/50"></div>
                    <div className="absolute bottom-[35%] left-0 w-full h-[2px] bg-secondary flex items-center px-2">
                        <span className="bg-secondary text-white text-[10px] px-1.5 py-0.5 rounded font-bold -mt-6 whitespace-nowrap">DRAFT: 2.1m</span>
                    </div>
                </div>
                <div className="flex justify-between text-xs font-bold text-outline uppercase tracking-wider">
                    <span>Low (0.8m)</span>
                    <span>High (5.4m)</span>
                </div>
            </div>
        </div>
    </div>
);