// ============================================================
// AUTH MODAL — Google-style sign-in popup
// Steps: Email → Name/Password → Success animation
// ============================================================
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props { isOpen: boolean; onClose: () => void }
type Step = 'email' | 'details' | 'success';

export default function AuthModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) { setStep('email'); setName(''); setEmail(''); setPassword(''); setError(''); setLoading(false); }
  }, [isOpen]);

  // Step 1: Validate email, go to details
  const handleEmailNext = () => {
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email'); return; }
    setError(''); setLoading(true);
    setTimeout(() => { setLoading(false); setStep('details'); }, 800);
  };

  // Step 2: Validate name/password, create account
  const handleSignup = () => {
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    setTimeout(() => {
      login(name.trim(), email.trim().toLowerCase());
      setLoading(false);
      setStep('success');
      setTimeout(handleClose, 1500);
    }, 1000);
  };

  const handleClose = () => {
    setTimeout(onClose, 300); // brief delay for animation
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* White Google-style modal */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ===== STEP 1: Email ===== */}
        {step === 'email' && (
          <div className="p-10 animate-scale-in">
            {/* Google logo */}
            <div className="flex justify-center mb-4 text-4xl font-normal">
              <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
            </div>
            <h2 className="text-2xl text-[#202124] text-center mb-1">Sign in</h2>
            <p className="text-sm text-[#5f6368] text-center mb-8">Use your Google Account to continue to VARC Arena</p>

            {/* Email input */}
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleEmailNext()}
              placeholder="Email address" autoFocus
              className={`w-full px-4 py-3.5 border ${error ? 'border-red-500' : 'border-[#dadce0]'} rounded-lg text-[#202124] placeholder:text-[#80868b] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20`} />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

            <p className="text-xs text-[#5f6368] mt-6 mb-8">
              Not your computer? Use Guest mode to sign in privately.
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <button className="text-sm text-[#1a73e8] font-medium">Create account</button>
              <button onClick={handleEmailNext} disabled={loading}
                className="px-6 py-2.5 bg-[#1a73e8] text-white text-sm font-medium rounded-md hover:bg-[#1765cc] disabled:opacity-50 flex items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Next'}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: Name & Password ===== */}
        {step === 'details' && (
          <div className="p-10 animate-scale-in">
            <div className="flex justify-center mb-4 text-3xl font-normal">
              <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
            </div>

            {/* Show email */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-xs font-bold">{email[0]?.toUpperCase()}</div>
              <span className="text-sm text-[#202124]">{email}</span>
            </div>

            <h2 className="text-xl text-[#202124] text-center mb-1">Welcome</h2>
            <p className="text-sm text-[#5f6368] text-center mb-6">Enter your name and create a password</p>

            {/* Name */}
            <input type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="Your full name" autoFocus
              className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] placeholder:text-[#80868b] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 mb-4" />

            {/* Password */}
            <div className="relative mb-2">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                placeholder="Create a password (min 6 chars)"
                className="w-full px-4 py-3 pr-10 border border-[#dadce0] rounded-lg text-[#202124] placeholder:text-[#80868b] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368]">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

            {/* Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button onClick={() => { setStep('email'); setError(''); }} className="text-sm text-[#1a73e8] font-medium">← Back</button>
              <button onClick={handleSignup} disabled={loading}
                className="px-6 py-2.5 bg-[#1a73e8] text-white text-sm font-medium rounded-md hover:bg-[#1765cc] disabled:opacity-50 flex items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create & Continue'}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Success ===== */}
        {step === 'success' && (
          <div className="p-10 animate-scale-in text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#34A853] flex items-center justify-center animate-bounce-in">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl text-[#202124] mb-2">Welcome, {name.split(' ')[0]}! 🎉</h2>
            <p className="text-sm text-[#5f6368]">Account created. Redirecting…</p>
          </div>
        )}
      </div>
    </div>
  );
}
