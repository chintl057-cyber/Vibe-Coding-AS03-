import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAlert, AuthFooterAction, AuthInput, AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';
import { authApi } from '../api/auth';

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await authApi.register(email, password, fullName);
      authApi.storeToken(response.accessToken, response.userId);
      navigate('/discovery');
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.detail || (err as any)?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your Basketly account" subtitle="Start saving on your weekly grocery basket.">
      {error && <AuthAlert tone="error" message={error} />}

      <AuthInput placeholder="Full name" value={fullName} onChange={setFullName} disabled={isLoading} />
      <AuthInput placeholder="Email address" value={email} onChange={setEmail} disabled={isLoading} />
      <AuthInput type="password" placeholder="Password" value={password} onChange={setPassword} disabled={isLoading} />
      <AuthInput type="password" placeholder="Confirm password" value={confirmPassword} onChange={setConfirmPassword} disabled={isLoading} />

      <Button className="w-full" onClick={handleCreateAccount} disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>

      <AuthFooterAction text="Already have an account?" actionLabel="Log in" onClick={() => navigate('/login')} />
    </AuthLayout>
  );
}
