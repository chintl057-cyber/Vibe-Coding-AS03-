import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthAlert, AuthFooterAction, AuthInput, AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as any)?.message || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setError('');
    navigate('/discovery');
  };

  return (
    <AuthLayout title="Compare grocery prices smarter." subtitle="Log in to continue your Basketly savings journey.">
      {message && <AuthAlert tone="success" message={message} />}
      {error && <AuthAlert tone="error" message={error} />}

      <AuthInput placeholder="Email" value={email} onChange={setEmail} />
      <AuthInput type="password" placeholder="Password" value={password} onChange={setPassword} />

      <Button className="w-full" onClick={handleLogin}>Log in</Button>

      <div className="space-y-1">
        <AuthFooterAction text="New to Basketly?" actionLabel="Create account" onClick={() => navigate('/register')} />
        <AuthFooterAction text="Need help accessing your account?" actionLabel="Forgot password?" onClick={() => navigate('/change-password')} />
      </div>
    </AuthLayout>
  );
}
