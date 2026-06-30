import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPasswordMutation } from '../api/authApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Music, Mail, CheckCircle } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      await forgotPassword(data).unwrap();
      setSent(true);
    } catch (err) {
      setError(err?.data?.message || 'Failed to send reset email');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-gray-500 dark:text-neutral-400 mb-6">
            We've sent a password reset link to your email address.
          </p>
          <Link to="/login" className="text-violet-500 hover:text-violet-600 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1">Enter your email to reset it</p>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full py-3">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#2A2A2A] text-center">
            <Link to="/login" className="text-sm text-gray-500 dark:text-neutral-400 hover:text-violet-500">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
