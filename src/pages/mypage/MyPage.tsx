import { useState } from 'react';
import { 
  Award, 
  MessageSquare, 
  CheckCircle, 
  Calendar,
  LogOut,
  Mail,
  Briefcase,
  Camera,
  Edit3,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { signout, updateUser } from '../../services/userService';
import type { UpdateUserRequest } from '../../types/user';
import type { Position } from '../../types/auth';
import { useNavigate } from 'react-router-dom';
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

const positions: { value: Position; label: string }[] = [
 { value: 'FRONTEND', label: '프론트엔드' },
    { value: 'BACKEND', label: '백엔드' },
    { value: 'DESIGNER', label: '디자인' },
    { value: 'AI', label: 'AI' },
    { value: 'FULLSTACK', label: '풀스택' },
    { value: 'SECURITY', label: '보안' },
    { value: 'UNKNOWN', label: '미정' },
    { value: 'OTHER', label: '기타' },
];

export const MyPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [editForm, setEditForm] = useState<UpdateUserRequest>({
    name: user?.name || '',
    email: user?.email || '',
    position: (user?.position as Position) || 'FRONTEND',
    company: user?.company || '',
    joinedDate: user?.joinedDate || ''
  });

  const myPosts = user?.myPostList ?? [];
  const initials = user?.name?.substring(0, 2) || '??';
  const positionLabel = positions.find(p => p.value === user?.position)?.label || user?.position;

  const handleToggleEdit = async () => {
    if (isEditing) {
      if (!editForm.name || !editForm.email || !editForm.position || !editForm.company || !editForm.joinedDate) {
        setEditError('모든 항목을 입력해주세요.');
        return;
      }
      setIsSaving(true);
      setEditError('');
      try {
        await updateUser(editForm);
        updateProfile(editForm);
        setIsEditing(false);
      } catch (e: any) {
        setEditError(e.response?.data?.message || '수정에 실패했습니다.');
      } finally {
        setIsSaving(false);
      }
    } else {
      setEditError('');
      setEditForm({
        name: user?.name || '',
        email: user?.email || '',
        position: (user?.position as Position) || 'FRONTEND',
        company: user?.company || '',
        joinedDate: user?.joinedDate || ''
      });
      setIsEditing(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSignout = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return;
    try {
      await signout();
      await logout();
      navigate('/login');
    } catch {
      alert('회원탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Profile Section */}
      <section className="relative h-64 rounded-3xl overflow-hidden border border-border-light shadow-2xl">
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
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value as Position })}
                    className="bg-white/10 rounded px-2 py-0.5 outline-none border border-white/10 focus:border-white/30 text-white appearance-none cursor-pointer [&>option]:bg-bg-surface [&>option]:text-text-primary"
                  >
                    <option value="" disabled>직군 선택</option>
                    {positions.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                ) : (
                  <span>{positionLabel}</span>
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
                      value={editForm.joinedDate}
                      onChange={(e) => setEditForm({ ...editForm, joinedDate: e.target.value })}
                      className="bg-white/10 rounded px-2 py-0.5 outline-none border border-white/10 focus:border-white/30 text-white"
                    />
                    <span>입사</span>
                  </div>
                ) : (
                  <span>{user?.joinedDate} 입사</span>
                )}
              </div>
            </div>

            {editError && (
              <p className="text-xs text-danger font-bold">{editError}</p>
            )}
          </div>

          <div className="flex gap-3 mb-2">
            <button 
              onClick={handleToggleEdit}
              disabled={isSaving}
              className={cn(
                "px-6 py-2.5 rounded-xl border backdrop-blur-sm text-sm font-bold transition-all flex items-center gap-2 shadow-xl disabled:opacity-50",
                isEditing 
                  ? "bg-primary text-white border-primary hover:bg-primary/80" 
                  : "bg-bg-surface/50 border-border text-text-primary hover:border-primary"
              )}
            >
              {isEditing ? <CheckCircle size={16} /> : <Edit3 size={16} />} 
              {isSaving ? '저장 중...' : isEditing ? '변경사항 저장' : '프로필 편집'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="작성한 글" value={`${user?.postCount ?? 0}개`} icon={MessageSquare} />
        <StatCard label="남긴 답변" value={`${user?.myCommentCount ?? 0}개`} icon={CheckCircle} />
        <StatCard label="현재 포인트" value={`${user?.point?.toLocaleString() ?? 0}P`} icon={Award} />
{/* <StatCard label="구매한 상품" value="0개" icon={ShoppingBag} /> */}
      </section>

      {/* 내가 쓴 글 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="text-primary" size={20} /> 내가 쓴 글
          </h2>
        </div>
        {myPosts.length === 0 ? (
          <div className="glass-card p-8 text-center text-text-muted">작성한 글이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myPosts.map((post, index) => (
              <div key={index} className="glass-card p-4 flex items-center gap-4 group cursor-pointer h-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.isResolved && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20 shrink-0">해결됨</span>
                    )}
                    <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>댓글 {post.commentCount}개</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-text-secondary flex items-center gap-1 justify-end">
                    <MessageSquare size={14} />
                    <span className="text-xs font-medium">{post.commentCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 계정 관리 */}
      <section className="glass-card p-8 border-border-light bg-danger/5">
        <h3 className="text-xl font-bold text-danger flex items-center gap-2 mb-8 tracking-tight">
          계정 관리
        </h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleLogout}
            className="px-8 py-3 rounded-xl bg-danger text-white font-bold shadow-xl shadow-danger/20 hover:bg-danger/80 transition-all flex items-center gap-2"
          >
            <LogOut size={18} /> 로그아웃
          </button>
          <button
            onClick={handleSignout}
            className="px-8 py-3 rounded-xl border border-danger/30 text-danger font-bold hover:bg-danger/10 transition-all"
          >
            회원 탈퇴
          </button>
        </div>
      </section>
    </div>
  );
};