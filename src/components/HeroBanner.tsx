import { useEffect, useState } from 'react';
import { ShoppingBasket } from 'lucide-react';

interface HeroSlide {
  label: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    label: 'Basketly',
    title: 'The choice of smart shoppers',
    subtitle: 'Trusted grocery comparisons for confident weekly savings.',
    icon: '🧺',
    gradient: 'from-brand-600 via-brand-500 to-emerald-500',
  },
  {
    label: 'Weekly savings',
    title: 'This week’s half-price picks',
    subtitle: 'Track the best grocery savings before you shop',
    icon: '🏷️',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
  },
  {
    label: 'Smart comparison',
    title: 'Find the best deals in the best location',
    subtitle: 'Compare stores, build your basket, and shop smarter',
    icon: '📍',
    gradient: 'from-teal-600 via-emerald-500 to-lime-500',
  },
];

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section aria-label="Basketly hero banner carousel" className="relative mb-6 overflow-hidden rounded-3xl shadow-soft">
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.title}
            aria-hidden={!isActive}
            className={`absolute inset-0 bg-gradient-to-br px-6 py-6 text-white transition-all duration-700 ${slide.gradient} ${
              isActive ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-2 opacity-0'
            }`}
          >
            {index === 0 && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                <ShoppingBasket size={14} /> Basketly
              </div>
            )}
            {index === 1 && (
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-orange-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-100 ring-1 ring-orange-300/40">
                🔥 Hot grocery savings
              </div>
            )}
            <div className="absolute -right-3 -top-3 text-7xl opacity-25">{slide.icon}</div>
            <div className="absolute bottom-2 right-10 text-4xl opacity-30">🔥</div>
            <div className="absolute left-1/2 top-6 h-24 w-24 -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
              {index === 0 ? 'Smart grocery savings' : slide.label}
            </p>
            <h2 className="mt-2 max-w-sm text-3xl font-extrabold leading-tight">{slide.title}</h2>
            <p className="mt-2 max-w-md text-sm text-emerald-50">{slide.subtitle}</p>
          </div>
        );
      })}

      <div className="relative z-10 mt-[172px] flex justify-center gap-2 pb-3">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show hero slide ${index + 1}: ${slide.title}`}
              className={`h-2.5 rounded-full transition-all ${isActive ? 'w-6 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'}`}
            />
          );
        })}
      </div>
    </section>
  );
}
