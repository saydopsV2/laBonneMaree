export const HeroCountdown = () => (
    <div className="md:col-span-8 overflow-hidden rounded-xl ocean-gradient relative text-white p-8 min-h-[400px] flex flex-col justify-between shadow-xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <svg className="w-full h-full stroke-white fill-none stroke-[0.5]" viewBox="0 0 100 100">
                <circle cx="100" cy="0" r="40" />
                <circle cx="100" cy="0" r="60" />
                <circle cx="100" cy="0" r="80" />
                <line x1="100" x2="0" y1="0" y2="100" />
            </svg>
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary-fixed mb-6">
                <span className="material-symbols-outlined">timer</span>
                <span className="font-label text-sm font-bold tracking-widest uppercase">Time to port closure</span>
            </div>
            <div className="flex items-baseline gap-4">
                <span className="font-headline text-8xl font-black tracking-tighter">01:42</span>
                <span className="font-headline text-2xl font-bold text-primary-fixed opacity-70">HRS</span>
            </div>
            <p className="mt-4 text-primary-fixed max-w-xs text-lg font-medium">
                Port of Brest entry remains accessible. Recommend approach within the next 45 minutes.
            </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-4 mt-8">
            <button className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:opacity-90 transition-opacity shadow-lg shadow-secondary/20">
                <span className="material-symbols-outlined">emergency_home</span> Request Landing
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                Route Analytics
            </button>
        </div>
    </div>
);