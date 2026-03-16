import { Header } from "./components/Header";
import { HeroCountdown } from "./components/HeroCountdown";
import { TideInstrument } from "./components/TideInstrument";
import { SafetyStatus } from "./components/SafetyStatus";
import { LocationCard } from "./components/LocationCard";
import { BottomNav } from "./components/BottomNav";

function App() {
  return (
      <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 px-6 pt-8 pb-32 max-w-7xl mx-auto w-full">
          {/* Dashboard Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label text-xs font-bold uppercase tracking-widest text-outline mb-2 block">Vessel Overview</span>
              <h2 className="font-headline text-4xl font-extrabold text-primary">Dashboard</h2>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-xl">
              <div className="px-4 py-2 bg-surface-container-lowest rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-label text-sm font-semibold text-on-surface">Port Entry Window</span>
              </div>
            </div>
          </div>

          {/* Main Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <HeroCountdown />
            <TideInstrument />
            <SafetyStatus />
            <LocationCard />
          </div>
        </main>
        
        <BottomNav />
      </div>
  );
}

export default App;