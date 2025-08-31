import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, User, Smartphone, ArrowRight, Chrome, Calendar } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import rightColumnImage from '../assets/right-column.svg';
import logoImage from '../assets/Logo.svg';

interface SignUpData {
  email: string;
  name: string;
  dateOfBirth: string;
}

interface VerifyOTPData {
  email: string;
  otp: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [formData, setFormData] = useState<SignUpData>({ email: '', name: '', dateOfBirth: '' });
  const [otp, setOtp] = useState('');

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpData) => api.post('/auth/signup-email', data),
    onSuccess: () => {
      setStep('otp');
      toast.success('OTP sent to your email!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to send OTP');
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: (data: VerifyOTPData) => api.post('/auth/verify-otp', data),
    onSuccess: (response) => {
      const { token, user } = response.data;
      login(token, user);
      toast.success('Account created successfully!');
      navigate('/welcome');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to verify OTP');
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: () => api.post('/auth/google/start'),
    onSuccess: (response) => {
      const { redirectUrl } = response.data;
      const popup = window.open(redirectUrl, 'google-auth', 'width=500,height=600');

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          const { token, user } = event.data.data;
          login(token, user);
          toast.success('Signed up with Google successfully!');
          navigate('/welcome');
          popup?.close();
          window.removeEventListener('message', handleMessage);
        }
      };
      window.addEventListener('message', handleMessage);
    },
    onError: () => {
      toast.error('Failed to start Google authentication');
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUpMutation.mutate(formData);
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOTPMutation.mutate({ email: formData.email, otp });
  };

  const handleGoogleAuth = () => {
    googleAuthMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="HD Logo" 
                className="h-6 w-6 mr-2"
              />
              <h1 className="text-xl font-semibold text-gray-900">HD</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side (form) */}
        <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center items-center mb-4">
              
              <h2 className="text-3xl font-extrabold text-gray-900">
                Sign up
              </h2>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign up to enjoy the feature of HD
            </p>
          </div>

          {step === 'email' ? (
            <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
              <div className="space-y-4">
                                 <div>
                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                     Full Name
                   </label>
                   <div className="mt-1 relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <User className="h-5 w-5 text-gray-400" />
                     </div>
                     <input
                       id="name"
                       name="name"
                       type="text"
                       required
                       className="input-field pl-10"
                       placeholder="Enter your full name"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     />
                   </div>
                 </div>

                 

                                   <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="input-field pl-10"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth 
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        className="input-field pl-10"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                 
              </div>

              <div>
                <button
                  type="submit"
                  disabled={signUpMutation.isPending}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {signUpMutation.isPending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Get OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={googleAuthMutation.isPending}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Google
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleOTPSubmit}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  We've sent a 6-digit code to {formData.email}
                </p>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="input-field pl-10 text-center text-lg tracking-widest"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={verifyOTPMutation.isPending || otp.length !== 6}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {verifyOTPMutation.isPending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  ← Back to email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right side (image for desktop only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-white">
        <img
          src={rightColumnImage}
          alt="Signup illustration"
          className="w-full h-full object-fit"
        />
      </div>
    </div>
  </div>
  );
};

export default SignUp;
