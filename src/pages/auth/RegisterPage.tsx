import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Building, Mail, Lock, Calendar, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { signup } from '../../services/authService';
import { checkEmail } from '../../services/authService';
import type { Position } from '../../types/auth';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    name: '',
    position: '' as Position,
    joinedDate: '',
    password: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      setEmailMessage('이메일을 입력해주세요.');
      setEmailChecked(false);
      return;
    }
    setIsCheckingEmail(true);
    setEmailMessage('');
    try {
      const message = await checkEmail(formData.email);
      setEmailMessage(message || '사용 가능한 이메일입니다.');
      setEmailChecked(true);
    } catch (e: any) {
      setEmailMessage(e.response?.data?.message || '이미 사용 중인 이메일입니다.');
      setEmailChecked(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.company || !formData.email || !formData.name ||
        !formData.position || !formData.joinedDate || !formData.password) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    if (!emailChecked) {
      setError('이메일 중복확인을 해주세요.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        company: formData.company,
        position: formData.position,
        joinedDate: formData.joinedDate,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions: { value: Position; label: string }[] = [
    { value: 'FRONTEND', label: '프론트엔드' },
    { value: 'BACKEND', label: '백엔드' },
    { value: 'DESIGNER', label: '디자인' },
    { value: 'DEVOPS', label: 'DevOps' },
    { value: 'PM', label: '기획/PM' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-base relative overflow-hidden dot-grid py-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] p-8 glass-card border-border-light relative z-10 m-4"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
            <UserPlus size={28} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Ask Hub 가입</h1>
          <p className="text-text-secondary">효율적인 협업을 위한 첫 단계를 시작하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">회사명</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full input-field pl-9 text-sm h-10" 
                  placeholder="회사명 입력"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">Email (ID)</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      setEmailChecked(false);
                      setEmailMessage('');
                    }}
                    className="w-full input-field pl-9 text-sm h-10" 
                    placeholder="email@company.com"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCheckEmail}
                  disabled={isCheckingEmail || !formData.email}
                  className={`px-3 border rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
                    emailChecked
                      ? 'bg-success/10 border-success text-success'
                      : 'bg-bg-elevated border-border hover:border-primary'
                  }`}
                >
                  {isCheckingEmail ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : emailChecked ? '확인완료' : '중복확인'}
                </button>
              </div>
              {emailMessage && (
                <p className={`text-[11px] font-medium mt-1 ml-1 ${emailChecked ? 'text-success' : 'text-danger'}`}>
                  {emailMessage}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">성명</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full input-field pl-9 text-sm h-10" 
                  placeholder="홍길동"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">직군</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <select 
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full input-field pl-9 text-sm h-10 appearance-none"
                >
                  <option value="">직군 선택</option>
                  {positions.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">입사일</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                name="joinedDate"
                type="date"
                value={formData.joinedDate}
                onChange={handleChange}
                className="w-full input-field pl-9 text-sm h-10" 
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full input-field pl-9 text-sm h-10" 
                  placeholder="8~16자, 영문+숫자 혼합"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${formData.password.length > i * 3 ? 'bg-primary' : 'bg-border'}`} />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5 ml-1">비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full input-field pl-9 text-sm h-10" 
                  placeholder="••••••••"
                />
              </div>
              {/* 비밀번호 불일치 실시간 표시 */}
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-[11px] text-danger font-medium mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
              )}
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

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-primary h-12 mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : '가입하기'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary">
            이미 계정이 있으신가요? <Link to="/login" className="text-primary hover:underline font-bold ml-1">로그인하기</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};