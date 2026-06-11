import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAlert, AuthFooterAction, AuthInput, AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';
import { authApi } from '../api/auth';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!email.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await authApi.changePassword(email, newPassword);
      navigate('/login', { state: { message: 'Password updated successfully. Please log in.' } });
    } catch (err) {
      const errorMessage = (err as any)?.response?.data?.detail || (err as any)?.message || 'Password change failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and choose a new password.">
      {error && <AuthAlert tone="error" message={error} />}

      <AuthInput placeholder="Email address" value={email} onChange={setEmail} disabled={isLoading} />
      <AuthInput type="password" placeholder="New password" value={newPassword} onChange={setNewPassword} disabled={isLoading} />
      <AuthInput
        type="password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={setConfirmNewPassword}
        disabled={isLoading}
      />

      <Button className="w-full" onClick={handleUpdatePassword} disabled={isLoading}>
        {isLoading ? 'Updating password...' : 'Update password'}
      </Button>

      <AuthFooterAction text="Remembered your password?" actionLabel="Back to login" onClick={() => navigate('/login')} />
    </AuthLayout>
  );
}
