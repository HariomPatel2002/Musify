import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../api/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { setRefreshToken } from '../utils/tokenStorage';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Music } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ user: result.data, accessToken: result.data.accessToken }));
      setRefreshToken(result.data.refreshToken);
      navigate('/');
    } catch (err) {
      setServerError(err?.data?.message || 'Login failed. Is the server running?');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-1">Sign in to continue listening</p>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-violet-500 hover:text-violet-600">
                Forgot password?
              </Link>
            </div>
            {serverError && <p className="text-sm text-red-500">{serverError}</p>}
            {error && !serverError && <p className="text-sm text-red-500">{error.data?.message || 'Connection refused'}</p>}
            <Button type="submit" disabled={isLoading} className="w-full py-3 mt-2">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#2A2A2A] text-center">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-violet-500 hover:text-violet-600 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
