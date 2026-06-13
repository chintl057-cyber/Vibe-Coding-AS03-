import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { BasketPage } from './pages/BasketPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { AppShell } from './components/layout/AppShell';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route element={<AppShell />}>
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
