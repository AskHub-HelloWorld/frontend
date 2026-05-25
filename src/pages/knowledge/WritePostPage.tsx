import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Info
} from 'lucide-react';
import { createPost } from '../../services/postService';
import type { Category } from '../../types/post';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const positions: { value: Category; label: string }[] = [
  { value: 'FRONTEND', label: '프론트엔드' },
  { value: 'BACKEND', label: '백엔드' },
  { value: 'AI', label: 'AI' },
  { value: 'DESIGNER', label: '디자인' },
  { value: 'FULLSTACK', label: '풀스택' },
  { value: 'SECURITY', label: '보안' },
  { value: 'UNKNOWN', label: '미정' },
  { value: 'OTHER', label: '기타' },
];

export const WritePostPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editPost = location.state?.post;
  const draftData = location.state?.draft || '';

  const [title, setTitle] = useState(editPost?.title || '');
  const [content, setContent] = useState(editPost?.content || draftData);
  const [isAnonymous, setIsAnonymous] = useState(editPost?.isAnonymous || false);
  const [selectedPosition, setSelectedPosition] = useState<Category | ''>(
    editPost?.position || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!title.trim() || !content.trim() || !selectedPosition) return;
    setError('');
    setIsSubmitting(true);
    try {
      const postId = await createPost({
        title,
        content,
        isAnonymous,
        position: selectedPosition,
        point: 50,
      });
      navigate(`/knowledge/post/${postId}`); // 생성된 게시글 상세로 이동
    } catch (e: any) {
      setError(e.response?.data?.message || '게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-bold"
        >
          <ArrowLeft size={18} /> 질문 취소
        </button>
        <h1 className="text-xl font-heading font-black text-text-primary">
          {editPost ? '질문 수정하기' : '지식인에 질문하기'}
        </h1>
        <div className="w-20 hidden md:block" />
      </div>

      <div className="glass-card p-6 md:p-10 space-y-8 border-border-light shadow-2xl">
        {/* 안내 메시지 */}
        <div className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 text-primary">
          <Info size={20} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold leading-none">답변 채택 시 포인트가 차감되지 않습니다.</p>
            <p className="text-xs text-primary/80 opacity-80">최대한 구체적으로 질문을 작성하시면 동료들로부터 더 정확한 답변을 얻을 수 있습니다.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-text-muted uppercase tracking-widest ml-1">질문 제목</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-bg-base border border-border rounded-xl px-4 py-3 text-lg font-bold placeholder:text-text-muted focus:outline-none focus:border-primary focus:shadow-glow transition-all" 
              placeholder="궁금한 내용을 한 문장으로 요약해 주세요."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* 직군 선택 - 단일 선택 + API enum */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-text-muted uppercase tracking-widest ml-1">
                답변 희망 직군 <span className="text-danger">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {positions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedPosition(value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                      selectedPosition === value
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-bg-elevated border-border text-text-muted hover:border-text-secondary"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {!selectedPosition && (
                <p className="text-[10px] text-text-muted ml-1">직군을 선택해주세요.</p>
              )}
            </div>

            <div className="space-y-4">
              {/* 익명 설정 */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-text-muted uppercase tracking-widest ml-1">공개 설정</label>
                <div 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                    isAnonymous ? "border-primary bg-primary/5" : "border-border bg-bg-base"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      isAnonymous ? "bg-primary text-white" : "bg-bg-elevated text-text-muted"
                    )}>
                      <Check size={20} className={isAnonymous ? "opacity-100" : "opacity-20"} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", isAnonymous ? "text-primary" : "text-text-primary")}>익명으로 질문하기</p>
                      <p className="text-[10px] text-text-muted">이름과 부서가 숨겨진 채 게시됩니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-black text-text-muted uppercase tracking-widest ml-1">상세 내용</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-bg-base border border-border rounded-xl px-4 py-4 text-base min-h-[300px] placeholder:text-text-muted focus:outline-none focus:border-primary focus:shadow-glow transition-all" 
              placeholder="답변을 작성하는 동료들이 이해하기 쉽게 배경과 구체적인 상황을 설명해 주세요."
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-danger font-medium">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button 
            onClick={() => navigate(-1)}
            className="px-8 py-3 rounded-xl border border-border font-bold text-text-secondary hover:bg-bg-elevated transition-all"
          >
            취소
          </button>
          <button 
            onClick={handleRegister}
            disabled={!title.trim() || !content.trim() || !selectedPosition || isSubmitting}
            className="btn-primary px-10 py-3 h-auto text-base font-black shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              editPost ? '수정 완료' : '질문 등록'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};