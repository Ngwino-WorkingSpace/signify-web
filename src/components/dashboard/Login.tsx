import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, Globe, User, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';
import { apiService, AuthResponse } from '../../services/api';

interface AuthProps {
  onLogin: (authData: AuthResponse) => void;
}

export const Login = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    organization: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let authData;
      if (isLogin) {
        authData = await apiService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        authData = await apiService.register({
          email: formData.email,
          password: formData.password,
          name: formData.fullName
        });
      }
      onLogin(authData);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        {/* Left Side: Creative Visual Panel */}
        <div className="w-full md:w-1/2 relative bg-[#18392b] overflow-hidden p-12 flex flex-col justify-between order-2 md:order-1">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1561573930-cd6ff650d6ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#18392b] via-[#18392b]/90 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <Logo size={48} textColor="text-white" />
            
            <div className="mt-20 space-y-8">
              <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                Data for <br />
                <span className="text-emerald-400">Better Health.</span>
              </h1>
              <p className="text-emerald-50/70 text-lg max-w-md leading-relaxed">
                Join a global network of health planners and NGOs using community signals to drive preventive health policy.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#18392b] bg-emerald-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-white">
                  <p className="text-sm font-bold">Trusted by 500+ Analysts</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 bg-emerald-400 rounded-full"></div>)}
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-xs italic">
                "Signify has transformed how we respond to seasonal outbreaks in remote districts."
              </p>
            </div>

            <div className="flex items-center justify-between text-white/50 text-xs px-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe size={14} className="text-emerald-400" />
                <span>Multi-region Nodes</span>
              </div>
            </div>
          </div>

          {/* Abstract blobs */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/4 -left-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-[60px]"></div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center order-1 md:order-2">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Admin Account'}
              </h2>
              <p className="text-gray-500 font-medium">
                {isLogin 
                  ? 'Access your health intelligence dashboard.' 
                  : 'Start monitoring community signals today.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              {!isLogin && (
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#18392b]/5 focus:border-[#18392b] transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Organization</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="Ministry of Health"
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#18392b]/5 focus:border-[#18392b] transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email" 
                    placeholder="admin@organization.org"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#18392b]/5 focus:border-[#18392b] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                  {isLogin && <a href="#" className="text-[10px] font-black text-[#18392b] hover:underline uppercase tracking-widest">Forgot?</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#18392b]/5 focus:border-[#18392b] transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#18392b] text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#18392b]/20 disabled:opacity-70 group mt-4"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In to Portal' : 'Create Admin Account'}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-bold text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  onClick={toggleMode}
                  className="text-[#18392b] hover:underline ml-1 cursor-pointer"
                >
                  {isLogin ? 'Request Access' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Verification Badges */}
            <div className="mt-12 flex items-center justify-center space-x-6 opacity-30">
              <div className="flex flex-col items-center">
                <CheckCircle2 size={16} />
                <span className="text-[8px] font-black mt-1 uppercase tracking-widest">Secure</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <ShieldCheck size={16} />
                <span className="text-[8px] font-black mt-1 uppercase tracking-widest">Privacy</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <Globe size={16} />
                <span className="text-[8px] font-black mt-1 uppercase tracking-widest">Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
