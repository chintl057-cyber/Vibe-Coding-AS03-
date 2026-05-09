import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAlert, AuthFooterAction, AuthInput, AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateAccount = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    navigate('/login', { state: { message: 'Account created successfully. Please log in.' } });
  };

  return (
    <AuthLayout title="Create your Basketly account" subtitle="Start saving on your weekly grocery basket.">
      {error && <AuthAlert tone="error" message={error} />}

      <AuthInput placeholder="Full name" value={fullName} onChange={setFullName} />
      <AuthInput placeholder="Email address" value={email} onChange={setEmail} />
      <AuthInput type="password" placeholder="Password" value={password} onChange={setPassword} />
      <AuthInput type="password" placeholder="Confirm password" value={confirmPassword} onChange={setConfirmPassword} />

      <Button className="w-full" onClick={handleCreateAccount}>Create account</Button>

      <AuthFooterAction text="Already have an account?" actionLabel="Log in" onClick={() => navigate('/login')} />
    </AuthLayout>
  );
}
