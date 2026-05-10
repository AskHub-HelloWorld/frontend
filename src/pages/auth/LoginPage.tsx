import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email);
      navigate('/dashboard');
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-base relative overflow-hidden dot-grid">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] p-8 glass-card border-border-light relative z-10 m-4"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-6 shadow-xl shadow-primary/30"
          >
          <img 
            src="/icon.svg" 
            alt="Ask Hub Logo"
            className="w-10 h-10" 
          />
          </motion.div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Ask Hub</h1>
          <p className="text-text-secondary">당신의 팀과 함께하는 AI 협업 공간</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-field pl-10" 
                placeholder="email@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-field pl-10 pr-10" 
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-danger font-medium"
            >
              {error}
            </motion.p>
          )}

          <div className="flex items-center justify-between text-xs py-2">
            <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-border bg-bg-elevated accent-primary" />
              <span>로그인 상태 유지</span>
            </label>
            <Link to="#" className="text-primary hover:underline font-medium">비밀번호 찾기</Link>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-primary h-11 relative overflow-hidden"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary">
            계정이 없으신가요? <Link to="/register" className="text-primary hover:underline font-bold ml-1">회원가입</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
