import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User as UserIcon, 
  CheckCircle, 
  Flag, 
  MessageCircle,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockComments } from '../../mock/data';
import { useAuth } from '../../context/AuthContext';
import { getPostDetail } from '../../services/postService';
import type { PostDetail } from '../../types/post';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ReportModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [reason, setReason] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md glass-card bg-bg-surface p-8 shadow-2xl border-border-light"
      >
        <div className="flex items-center gap-3 mb-6 text-danger">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <h3 className="text-xl font-bold">콘텐츠 신고하기</h3>
        </div>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          커뮤니티 가이드라인을 위반하는 부적절한 콘텐츠인가요? 신고 사유를 선택해 주시면 관리팀에서 신속히 검토하겠습니다.
        </p>
        <div className="space-y-4 mb-8">
          {['스팸 / 홍보성', '욕설 / 비방 / 혐오 표현', '개인정보 노출', '허위 정보 / 선동', '기타 사유'].map(r => (
            <label key={r} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-base/50 hover:border-primary transition-all cursor-pointer group">
              <input type="radio" name="reason" value={r} onChange={(e) => setReason(e.target.value)} className="w-4 h-4 accent-primary" />
              <span className={cn("text-sm transition-colors", reason === r ? "text-primary font-bold" : "text-text-secondary group-hover:text-text-primary")}>{r}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-border font-bold text-text-muted hover:bg-bg-elevated transition-all">취소</button>
          <button 
            disabled={!reason}
            onClick={() => { alert('신고가 접수되었습니다.'); onClose(); }}
            className="flex-1 px-4 py-3 rounded-xl bg-danger font-bold text-white shadow-lg shadow-danger/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            신고 제출
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  // comment는 API 구현 전까지 mock 유지
  const comments = mockComments[Number(id) as keyof typeof mockComments] || [];

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getPostDetail(Number(id));
        setPost(data);
      } catch {
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (isLoading) return <div className="text-center py-20 text-text-muted">불러오는 중...</div>;
  if (error || !post) return <div className="text-center py-20 text-text-muted">{error || '게시글을 찾을 수 없습니다.'}</div>;

  // isMine 필드가 상세조회 응답에 없으므로 writer로 비교
  const isPostAuthor = post.writer === user?.name;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <ReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />

      <button 
        onClick={() => navigate('/knowledge')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold">목록으로 돌아가기</span>
      </button>

      {/* Post Content */}
      <article className="glass-card p-6 lg:p-10 space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {post.isResolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-[11px] font-black border border-success/20 tracking-tighter">
                <CheckCircle size={12} /> 해결된 질문
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning text-[11px] font-black border border-warning/20 tracking-tighter">
                <ShieldAlert size={12} /> 답변이 필요한 질문
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-bg-elevated text-text-muted text-[11px] font-bold border border-border tracking-wider">
              {post.position}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-heading font-black text-text-primary leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-4 border-y border-border/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center text-text-muted border border-border">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{post.writer}</p>
                <p className="text-xs text-text-muted">
                  {new Date(post.createdAt).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <button className="p-2 text-text-muted hover:text-danger transition-colors">
              <Flag size={18} onClick={() => setReportModalOpen(true)} />
            </button>
          </div>
        </header>

        <div className="text-text-primary text-base leading-relaxed whitespace-pre-wrap min-h-[200px]">
          {post.content}
        </div>

        {/* 채택된 답변 미리보기 - 상세조회 응답에 포함 */}
        {post.isResolved && post.resolvedComment && (
          <div className="p-6 rounded-2xl bg-success/5 border border-success/20 space-y-3">
            <p className="text-xs font-black text-success uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle size={12} /> 채택된 답변
            </p>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
              {post.resolvedComment.content}
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="font-bold">{post.resolvedComment.writer}</span>
              <span>•</span>
              <span>{post.resolvedComment.position}</span>
              <span>•</span>
              <span>{new Date(post.resolvedComment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </article>

      {/* Comments Section - comment API 나오면 교체 예정 */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="text-primary" size={24} />
          답변 <span className="text-primary font-black ml-1">{post.commentCount}</span>
        </h3>

        <div className="space-y-4">
          <AnimatePresence>
            {[...comments].sort((a, b) => (b.isAdopted ? 1 : 0) - (a.isAdopted ? 1 : 0)).map((comment) => {
              const isMyComment = comment.isMy || comment.author === user?.name;
              return (
                <motion.div 
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "p-6 glass-card relative",
                    comment.isAdopted ? "border-success bg-success/5 shadow-lg shadow-success/5" : "border-border"
                  )}
                >
                  {comment.isAdopted && (
                    <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded bg-success text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <CheckCircle size={12} /> 채택
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center border",
                        comment.isAdopted ? "bg-success/20 text-success border-success/30" : "bg-bg-elevated border-border text-text-muted"
                      )}>
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">{comment.author}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-surface border border-border text-text-muted font-bold">{comment.department}</span>
                          {isMyComment && <span className="text-[10px] font-black text-primary uppercase ml-1">MY</span>}
                        </div>
                        <p className="text-[10px] text-text-muted">
                          {new Date(comment.createdAt).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {isPostAuthor && !post.isResolved && (
                        <button className="text-xs font-bold px-3 py-1.5 rounded-lg bg-bg-surface border border-success/30 text-success hover:bg-success hover:text-white transition-all">
                          채택하기
                        </button>
                      )}
                      <button className="p-2 text-text-muted hover:text-text-primary">
                        <Flag size={14} onClick={() => setReportModalOpen(true)} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Comment Input */}
        {post.isResolved ? (
          <div className="pt-8">
            <div className="p-6 rounded-2xl bg-success/5 border border-success/20 text-center space-y-2">
              <p className="text-sm font-bold text-success">해결된 질문입니다.</p>
              <p className="text-xs text-text-muted">채택된 답변이 있어 더 이상 답변을 남길 수 없습니다.</p>
            </div>
          </div>
        ) : !isPostAuthor ? (
          <div className="pt-8">
            <div className="glass-card border-primary/30 p-1 group flex flex-col focus-within:shadow-glow transition-all">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 p-4 text-sm text-text-primary min-h-[120px]"
                placeholder="도움이 될 만한 답변을 남겨주세요 (채택 시 활동 포인트가 지급됩니다)."
              />
              <div className="flex items-center justify-between p-3 bg-bg-base/50 rounded-b-lg border-t border-border">
                <span className="text-[10px] text-text-muted font-medium">비속어나 근거 없는 비방은 인사 처분될 수 있습니다.</span>
                <button
                  disabled={!commentInput.trim()}
                  className="btn-primary h-9 px-6 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  답변 등록
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-8">
            <div className="p-6 rounded-2xl bg-bg-elevated border border-border text-center space-y-2">
              <p className="text-sm font-bold text-text-secondary">자신의 질문에는 답변을 달 수 없습니다.</p>
              <p className="text-xs text-text-muted">동료들의 소중한 답변을 기다려보세요!</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};