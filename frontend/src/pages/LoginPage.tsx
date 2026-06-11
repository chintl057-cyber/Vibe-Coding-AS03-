import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthAlert, AuthFooterAction, AuthInput, AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';
import { authApi } from '../api/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as any)?.message || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await authApi.login(email, password);
      authApi.storeToken(response.accessToken, response.userId);
      navigate('/discovery');
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.detail || (err as any)?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Compare grocery prices smarter." subtitle="Log in to continue your Basketly savings journey.">
      {message && <AuthAlert tone="success" message={message} />}
      {error && <AuthAlert tone="error" message={error} />}

      <AuthInput placeholder="Email" value={email} onChange={setEmail} disabled={isLoading} />
      <AuthInput type="password" placeholder="Password" value={password} onChange={setPassword} disabled={isLoading} />

      <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>

      <div className="space-y-1">
        <AuthFooterAction text="New to Basketly?" actionLabel="Create account" onClick={() => navigate('/register')} />
        <AuthFooterAction text="Need help accessing your account?" actionLabel="Forgot password?" onClick={() => navigate('/change-password')} />
      </div>
    </AuthLayout>
  );
}
