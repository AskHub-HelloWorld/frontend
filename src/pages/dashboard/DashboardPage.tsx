import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Lightbulb, ShoppingBag, ArrowUpRight, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPosts } from '../../services/postService';
import type { PostItem } from '../../types/post';
import { motion } from 'motion/react';
import { formatDate, formatDateTime } from '../../utils/time';

const QuickActionCard = ({ title, description, icon: Icon, to, color }: any) => (
  <Link to={to}>
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex flex-col h-full relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-40 ${color}`} />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-text-secondary mb-6 flex-1">{description}</p>
      <div className="flex items-center text-primary text-sm font-bold gap-1 mt-auto">
        바로가기 <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </motion.div>
  </Link>
);

export const DashboardPage = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setIsLoading(true);
      try {
        const result = await getPosts({ page: 0, size: 6 });
        setRecentPosts(result.content);
      } catch {
        console.error('게시글 로딩 실패');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-heading font-bold text-text-primary"
          >
            안녕하세요, {user?.name}님 👋
          </motion.h1>
          <p className="text-text-secondary mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3 bg-bg-surface border border-border px-4 py-2 rounded-xl shadow-sm">
          <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider leading-none mb-1">내 포인트</p>
            <p className="text-lg font-heading font-bold text-text-primary">{user?.point?.toLocaleString() ?? 0} P</p>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard 
          title="AI 채팅" 
          description="사내 규정부터 프로젝트 지식까지 AI에게 무엇이든 물어보세요."
          icon={MessageSquare}
          to="/chat"
          color="bg-primary"
        />
        <QuickActionCard 
          title="지식인 Q&A" 
          description="동료의 질문에 답변하고 포인트를 획득하세요. 궁금한 점은 직접 질문해보세요."
          icon={Lightbulb}
          to="/knowledge"
          color="bg-accent"
        />
        <QuickActionCard 
          title="포인트 상점" 
          description="활동으로 모은 포인트로 기프티콘, 휴가권 등 다양한 상품을 구매하세요."
          icon={ShoppingBag}
          to="/store"
          color="bg-success"
        />
      </section>

      <div className="grid grid-cols-1 gap-8">
        {/* 실시간 지식인 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} /> 실시간 지식인
            </h2>
            <Link to="/knowledge" className="text-sm text-text-muted hover:text-primary transition-colors">더보기</Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-text-muted text-sm">불러오는 중...</div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-10 text-text-muted text-sm">게시글이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentPosts.map((post) => (
                <Link key={post.postId} to={`/knowledge/post/${post.postId}`}>
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="glass-card p-4 flex items-center gap-4 group cursor-pointer h-full"
                  >
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
                        <span>{post.writer}</span>
                        <span>•</span>
                        <span>{post.position}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-text-secondary flex items-center gap-1 justify-end">
                        <MessageSquare size={14} />
                        <span className="text-xs font-medium">{post.commentCount}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};