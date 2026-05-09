import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAlert, AuthFooterAction, AuthInput, AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdatePassword = () => {
    if (!email.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    setError('');
    navigate('/login', { state: { message: 'Password updated successfully. Please log in.' } });
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and choose a new password.">
      {error && <AuthAlert tone="error" message={error} />}

      <AuthInput placeholder="Email address" value={email} onChange={setEmail} />
      <AuthInput type="password" placeholder="New password" value={newPassword} onChange={setNewPassword} />
      <AuthInput
        type="password"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={setConfirmNewPassword}
      />

      <Button className="w-full" onClick={handleUpdatePassword}>Update password</Button>

      <AuthFooterAction text="Remembered your password?" actionLabel="Back to login" onClick={() => navigate('/login')} />
    </AuthLayout>
  );
}
