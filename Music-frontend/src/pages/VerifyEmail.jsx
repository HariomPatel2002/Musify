import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVerifyEmailQuery, useResendVerificationMutation } from '../api/authApi';
import { useSelector } from 'react-redux';
import Spinner from '../components/ui/Spinner';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

export default function VerifyEmail() {
  const { token } = useParams();
  const { data, isLoading, error } = useVerifyEmailQuery(token);
  const [resendVerification, { isLoading: resending }] = useResendVerificationMutation();
  const { user } = useSelector((state) => state.auth);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    try {
      await resendVerification().unwrap();
      setResent(true);
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Link expired or invalid</h1>
          <p className="text-gray-500 dark:text-neutral-400 mb-6">
            The verification link has expired or is invalid.
          </p>
          {user && !user.isVerified && (
            <div className="space-y-3">
              {resent ? (
                <p className="text-green-500 text-sm">Verification email sent!</p>
              ) : (
                <Button onClick={handleResend} disabled={resending}>
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              )}
            </div>
          )}
          <Link to="/" className="block mt-4 text-sm text-gray-500 hover:text-violet-500">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Email verified!</h1>
        <p className="text-gray-500 dark:text-neutral-400 mb-6">
          Your email has been verified. You can now upload songs.
        </p>
        <Link to="/" className="text-violet-500 hover:text-violet-600 font-medium">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
