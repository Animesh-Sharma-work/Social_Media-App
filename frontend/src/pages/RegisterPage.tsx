import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { MainLayout } from '../components/layout/MainLayout';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </MainLayout>
  );
};