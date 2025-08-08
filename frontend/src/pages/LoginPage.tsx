import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { MainLayout } from '../components/layout/MainLayout';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </MainLayout>
  );
};