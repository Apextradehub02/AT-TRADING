import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Phone,
  AlertCircle,
  CheckCircle2,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { STORE_INFO } from '../../data/mockData';

interface AdminLoginPageProps {
  onSuccessLogin: (adminUser: string) => void;
  onExitToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccessLogin,
  onExitToStore,
}) => {
  // Step 1: Credentials, Step 2: 2FA/OTP
  const [step, setStep] = useState<'credentials' | '2fa' | 'forgot_password'>('credentials');
  const [userIdOrEmail, setUserIdOrEmail] = useState('admin@attrading.in');
  const [password, setPassword] = useState('ATTrading@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [enable2FA, setEnable2FA] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2FA state
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(45);
  const [otpSentPhone] = useState(STORE_INFO.mobileNumber);
  const [generatedDemoOtp] = useState('700136'); // Pin code of Baguiati as mnemonic

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    let interval: any;
    if (step === '2fa' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!userIdOrEmail.trim() || !password.trim()) {
      setErrorMsg('Please enter both Admin User ID / Email and Password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (enable2FA) {
        setStep('2fa');
        setOtpTimer(45);
      } else {
        onSuccessLogin(userIdOrEmail);
      }
    }, 600);
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim() !== generatedDemoOtp && otpCode.trim() !== '123456') {
      setErrorMsg(`Invalid verification code. Use demo OTP: ${generatedDemoOtp} (or 123456)`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccessLogin(userIdOrEmail);
    }, 500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setStep('credentials');
    }, 2500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Lockup */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-850">
          <div className="w-14 h-14 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">
            AT TRADING Portal
          </h1>
          <p className="text-xs text-slate-400">
            Administrative Management &amp; Trading Command Center
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-400/90 font-mono bg-amber-950/40 border border-amber-800/40 px-2.5 py-0.5 rounded-full">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Baguiati Terminal, Kolkata-700136</span>
          </div>
        </div>

        {/* STEP 1: Admin Credentials Form */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 pt-6">
            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* User ID / Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Admin User ID / Email</span>
                <span className="text-[10px] text-slate-500">Superadmin Access</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type="text"
                  required
                  value={userIdOrEmail}
                  onChange={(e) => setUserIdOrEmail(e.target.value)}
                  placeholder="admin@attrading.in or admin_id"
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password with Show/Hide */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setStep('forgot_password')}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-white absolute right-2.5 top-2"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA/OTP Recommended Toggle */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-slate-200">2FA / OTP Verification</p>
                  <p className="text-[10px] text-slate-400">Recommended for terminal access</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Return to Customer storefront */}
            <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={onExitToStore}
                className="hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Store</span>
              </button>
              <span className="text-[11px] text-slate-500 font-mono">TLS 1.3 256-Bit</span>
            </div>
          </form>
        )}

        {/* STEP 2: 2FA / OTP Verification Step */}
        {step === '2fa' && (
          <form onSubmit={handleVerify2FA} className="space-y-5 pt-6 animate-in fade-in duration-200">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Phone className="w-4 h-4" />
                <span>Two-Factor Authentication (2FA)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Enter the 6-digit verification code sent to registered administrator contact:
              </p>
              <p className="font-mono font-bold text-white text-xs">
                +91 {otpSentPhone} (Baguiati Center)
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-300">Enter 6-Digit OTP</label>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedDemoOtp)}
                  className="text-[11px] text-amber-400 hover:underline font-mono"
                >
                  Autofill: {generatedDemoOtp}
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full mt-2 py-3 text-center text-xl tracking-[0.5em] font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {otpTimer > 0 ? (
                  <span>Resend available in <strong className="font-mono text-white">{otpTimer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOtpTimer(45)}
                    className="text-amber-400 hover:underline font-medium"
                  >
                    Resend Code Now
                  </button>
                )}
              </span>
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="hover:text-white"
              >
                Change Login
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 6}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify &amp; Enter Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Forgot Password Modal/Flow */}
        {step === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-sm font-bold text-white">Reset Admin Credentials</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your administrative email or registered phone (+91 {STORE_INFO.mobileNumber}) to receive a secure recovery key.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Admin Email or Phone</label>
              <input
                type="text"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@attrading.in or 9876543210"
                className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            {forgotSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recovery OTP dispatched to +91 {STORE_INFO.mobileNumber}. Redirecting...</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
              >
                Send Reset Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
