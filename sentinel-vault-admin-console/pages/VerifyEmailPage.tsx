
import React, { useState } from 'react';
import api from '../api/axiosClient';

interface Props {
  email: string;
  onNavigate: (page: 'login') => void;
}

const VerifyEmailPage: React.FC<Props> = ({ email, onNavigate }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/verify-email', { email, code });
      setSuccess(true);
      setTimeout(() => onNavigate('login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center">
        <div className="mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security Verification</h1>
            <p className="text-slate-500 text-sm mt-2">
                Sent to: <span className="font-bold text-slate-800">{email}</span>
            </p>
        </div>

        {success ? (
          <div className="p-6 bg-green-50 border border-green-200 text-green-700 rounded-xl space-y-2">
            <p className="font-bold text-lg">Verification Successful!</p>
            <p className="text-sm">Account activated. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-slate-600">Enter the 6-digit protocol code sent to your official mailbox.</p>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold">
                {error}
              </div>
            )}

            <input 
              type="text" 
              maxLength={6}
              required
              placeholder="0 0 0 0 0 0"
              className="w-full text-center p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-2xl font-black tracking-[1em] text-slate-800"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />

            <button 
              type="submit"
              disabled={isLoading || code.length < 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'VERIFYING...' : 'AUTHORIZE ACCESS'}
            </button>
            
            <button 
              type="button"
              onClick={() => onNavigate('login')}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold mt-4"
            >
              Back to Terminal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
