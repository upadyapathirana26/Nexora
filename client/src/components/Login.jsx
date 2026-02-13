// client/src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Step 1: Email + Password
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data.requiresOTP) {
        setStep('otp');
        setEmail(res.data.email);
      } else {
        // Fallback: direct login (if OTP ever disabled)
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });

      // ✅ Save session
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // ✅ Redirect to home
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-nexora-primary">Nexora</h1>
          <p className="text-gray-600 mt-2">
            {step === 'credentials' ? 'Sign in to your account' : 'Enter the code sent to your email'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          // Step 1: Credentials Form
          <form onSubmit={handleCredentialSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-secondary focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-secondary focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-nexora-teal cursor-not-allowed'
                  : 'bg-nexora-primary hover:bg-nexora-secondary active:scale-[0.98]'
              }`}
            >
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>
        ) : (
          // Step 2: OTP Form
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-sm font-medium">
                One-Time Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-2.5 text-center text-2xl letter-spacing-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nexora-secondary focus:border-transparent"
                required
              />
              <p className="text-gray-500 text-sm mt-2">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-nexora-teal cursor-not-allowed'
                  : 'bg-nexora-primary hover:bg-nexora-secondary active:scale-[0.98]'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="mt-4 w-full text-nexora-secondary font-medium hover:underline"
            >
              ← Back to sign in
            </button>
          </form>
        )}

        {step === 'credentials' && (
          <div className="mt-6 text-center text-gray-600 text-sm">
            Don’t have an account?{' '}
            <a href="/register" className="text-nexora-secondary font-medium hover:underline">
              Sign up
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;