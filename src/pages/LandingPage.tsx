import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import AOS from 'aos';
import 'aos/dist/aos.css';

export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>
      <div className="space-y-8 relative z-10">
        <div
          className="text-8xl animate-spin-slow-delayed"
          data-aos="zoom-in"
        >
          🛒
        </div>
        <h1
          className="text-5xl font-extrabold text-slate-900"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Welcome to Basketly
        </h1>
        <p
          className="text-2xl text-slate-600 max-w-lg font-medium"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Shopping weekly groceries is never easier than before
        </p>
        <p
          className="text-lg text-slate-500 max-w-md"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Compare grocery prices across supermarkets and save money on your weekly shopping with smart recommendations.
        </p>
        
        <div
          className="flex gap-6 justify-center pt-6"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <Button onClick={() => navigate('/login')} className="px-10 py-3 text-lg">
            Log In
          </Button>
          <Button onClick={() => navigate('/register')} variant="secondary" className="px-10 py-3 text-lg">
            Create Account
          </Button>
        </div>
      </div>
    </main>
  );
}
