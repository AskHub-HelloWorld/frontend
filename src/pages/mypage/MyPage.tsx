import { useState } from 'react';
import { 
  User as
  Award, 
  MessageSquare, 
  CheckCircle, 
  ShoppingBag, 
  Calendar,
  LogOut,
  Mail,
  Briefcase,
  Camera,
  Edit3,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockPosts } from '../../mock/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ label, value, icon: Icon, trend }: any) => (
  <div className="glass-card p-6 border-border-light bg-gradient-to-br from-bg-surface to-bg-base/30">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-[10px] font-black py-0.5 px-2 rounded-full bg-success/10 text-success border border-success/20">
          +{trend}%
        </span>
      )}
    </div>
    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-heading font-black text-text-primary">{value}</p>
  </div>
);

const departments = ['프론트엔드', '백엔드', '디자인', '기획', 'QA', 'DevOps', '인사/총무', '영업'];

export const MyPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    company: user?.company || '',
    joinedAt: user?.joinedAt || ''
  });

  const myPosts = mockPosts.filter(p => p.isMy);
  const initials = user?.name.substring(1, 3) || '??';

  const handleToggleEdit = () => {
    if (isEditing) {
      updateProfile(editForm);
    } else {
      // Form sync when entering edit mode
      setEditForm({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        company: user?.company || '',
        joinedAt: user?.joinedAt || ''
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Profile Section */}
      <section className="relative h-64 rounded-3xl overflow-hidden border border-border-light shadow-2xl">
        {/* Profile Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 dot-grid" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center text-white text-4xl font-black border-4 border-bg-base shadow-2xl overflow-hidden">
               {initials}
            </div>
            <button className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-bg-surface border border-border text-text-primary shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
              <Camera size={18} />
            </button>
          </div>
          
          <div className="flex-1 space-y-2 mb-2">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-2xl font-heading font-black text-white bg-white/10 rounded-lg px-3 py-1 outline-none border border-white/20 focus:border-white/50"
                  placeholder="이름"
                />
              ) : (
                <h1 className="text-3xl font-heading font-black text-white">{user?.name}</h1>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary font-medium">
              <div className="flex items-center gap-2">
                <Building size={16} />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="bg-white/10 rounded px-2 py-0.5 outline-none border border-white/10 focus:border-white/30 text-white"
                    placeholder="회사명"
                  />
                ) : (
                  <span>{user?.company}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={16} />
                {isEditing ? (
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="bg-white/10 rounded px-2 py-0.5 outline-none border border-white/10 focus:border-white/30 text-white appearance-none cursor-pointer [&>option]:bg-bg-surface [&>option]:text-text-primary"
                  >
                    <option value="" disabled className="bg-bg-surface">직군 선택</option>
                    {departments.map(d => (
                      <option key={d} value={d} className="bg-bg-surface">{d}</option>
                    ))}
                  </select>
                ) : (
                  <span>{user?.department}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-white/10 rounded px-2 py-0.5 outline-none border border-white/10 focus:border-white/30 text-white"
                    placeholder="이메일"
                  />
                ) : (
                  <span>{user?.email}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} /> 
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={editForm.joinedAt}
                      onChange={(e) => setEditForm({ ...editForm, joinedAt: e.target.value })}
                      className="bg-white/10 rounded px-2 py-0.5 outline-none border border-white/10 focus:border-white/30 text-white"
                    />
                    <span>입사</span>
                  </div>
                ) : (
                  <span>{user?.joinedAt} 입사</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-2">
            <button 
              onClick={handleToggleEdit}
              className={cn(
                "px-6 py-2.5 rounded-xl border backdrop-blur-sm text-sm font-bold transition-all flex items-center gap-2 shadow-xl",
                isEditing 
                  ? "bg-primary text-white border-primary hover:bg-primary/80" 
                  : "bg-bg-surface/50 border-border text-text-primary hover:border-primary"
              )}
            >
              {isEditing ? <CheckCircle size={16} /> : <Edit3 size={16} />} 
              {isEditing ? '변경사항 저장' : '프로필 편집'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="작성한 글" value={`${myPosts.length}개`} icon={MessageSquare} trend="8" />
        <StatCard label="남긴 답변" value="14개" icon={CheckCircle} trend="12" />
        <StatCard label="총 획득 포인트" value={`${user?.points.toLocaleString()}P`} icon={Award} />
        <StatCard label="구매한 상품" value="4개" icon={ShoppingBag} />
      </section>

      {/* Account Settings */}
      <section className="glass-card p-8 border-border-light bg-danger/5">
        <h3 className="text-xl font-bold text-danger flex items-center gap-2 mb-8 tracking-tight">
          계정 관리
        </h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={logout}
            className="px-8 py-3 rounded-xl bg-danger text-white font-bold shadow-xl shadow-danger/20 hover:bg-danger/80 transition-all flex items-center gap-2"
          >
            <LogOut size={18} /> 로그아웃
          </button>
          <button className="px-8 py-3 rounded-xl border border-danger/30 text-danger font-bold hover:bg-danger/10 transition-all">
            회원 탈퇴
          </button>
        </div>
      </section>
    </div>
  );
};
