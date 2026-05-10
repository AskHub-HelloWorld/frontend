import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  CheckCircle, 
  User as UserIcon, 
  ChevronRight,
  HelpCircle,
  MessageCircle,
  ChevronDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { mockPosts, mockComments } from '../../mock/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PostCard = ({ post, currentUserName }: { post: typeof mockPosts[0], currentUserName?: string, key?: React.Key }) => {
  const isAuthor = post.isMy || (post.author !== '익명' && post.author === currentUserName);
  const commentCount = mockComments[post.id as keyof typeof mockComments]?.length || 0;
  
  return (
    <Link to={`/knowledge/post/${post.id}`}>
      <motion.div 
        whileHover={{ scale: 1.01, x: 4 }}
        className="glass-card p-5 group cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {post.isResolved ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
                  <CheckCircle size={10} /> 해결됨
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold border border-warning/20">
                  <HelpCircle size={10} /> 답변 대기
                </span>
              )}
              {isAuthor && (
                 <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 tracking-wider">MY</span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-bg-elevated text-text-muted text-[10px] font-bold border border-border">{post.department}</span>
            </div>
            <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>
          </div>
        </div>
        
        <p className="text-sm text-text-secondary line-clamp-2 mb-4 leading-relaxed">
          {post.content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-bg-elevated flex items-center justify-center text-text-muted border border-border">
              <UserIcon size={12} />
            </div>
            <span className="text-xs font-medium text-text-secondary">{post.author}</span>
            <span className="text-text-muted mx-1">•</span>
            <span className="text-xs text-text-muted">{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-3 text-text-muted">
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <MessageSquare size={14} />
              <span className="text-xs font-bold">{commentCount}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export const KnowledgePage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('전체');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const departments = ['프론트엔드', '백엔드', '디자인', '기획', 'QA', 'DevOps', '인사/총무', '영업'];

  // Get posts that the user has commented on
  const answeredPostIds = Object.keys(mockComments)
    .filter(postId => (mockComments as any)[postId].some((c: any) => c.isMy || c.author === user?.name))
    .map(Number);

  const allFilteredPosts = mockPosts.filter(post => {
    // 1. Special Filters from Sidebar
    if (filter === '내가 쓴 글' && !post.isMy) return false;
    if (filter === '내가 답변한 글' && !answeredPostIds.includes(post.id)) return false;

    // 2. Unresolved Filter
    if (filter === '미답변만' && post.isResolved) return false;
    
    // 3. Category Filter
    if (selectedCategories.length > 0) {
      if (!selectedCategories.includes(post.department)) return false;
    }
    
    return true;
  });

  const totalPages = Math.ceil(allFilteredPosts.length / itemsPerPage);
  const currentPosts = allFilteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const myAnsweredPosts = mockPosts.filter(p => answeredPostIds.includes(p.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      {/* Main Content Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-14">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              className="w-full h-full bg-bg-surface border border-border rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:shadow-glow transition-all" 
              placeholder="무엇이든 검색해보세요 (예: 연차 정책, 코드 가이드...)"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {['전체', '미답변만', '내가 쓴 글', '내가 답변한 글'].filter(cat => 
                (cat !== '내가 쓴 글' && cat !== '내가 답변한 글') || filter === cat
              ).map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setFilter(cat); setCurrentPage(1); }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all border shrink-0",
                    filter === cat 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-bg-elevated text-text-muted border-border hover:border-primary/50"
                  )}
                >
                  {cat}
                </button>
              ))}

              <div className="relative shrink-0">
                <button 
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all border flex items-center gap-2",
                    isCategoryOpen || selectedCategories.length > 0
                      ? "bg-primary/10 text-primary border-primary/30" 
                      : "bg-bg-elevated text-text-muted border-border hover:border-primary/50"
                  )}
                >
                  카테고리 {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                  <ChevronDown size={14} className={cn("transition-transform", isCategoryOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full mt-2 left-0 z-20 w-48 glass-card p-2 shadow-2xl border-border-light bg-bg-surface"
                      >
                        <div className="grid grid-cols-1 gap-1">
                          {departments.map(dept => (
                            <button
                              key={dept}
                              onClick={() => toggleCategory(dept)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                                selectedCategories.includes(dept)
                                  ? "bg-primary text-white"
                                  : "text-text-secondary hover:bg-white/5"
                              )}
                            >
                              {dept}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Selected Categories in small row next to buttons */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 ml-2 border-l border-border pl-4">
                  {selectedCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black border border-primary/20 hover:bg-primary hover:text-white transition-all group"
                    >
                      {cat}
                      <X size={10} className="opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                  <button 
                    onClick={() => setSelectedCategories([])}
                    className="p-1 text-text-muted hover:text-danger ml-1"
                    title="초기화"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {currentPosts.map(post => <PostCard key={post.id} post={post} currentUserName={user?.name} />)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-10">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl border border-border bg-bg-surface flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "w-10 h-10 rounded-xl font-bold text-sm transition-all border",
                  currentPage === page 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-bg-surface text-text-muted border-border hover:border-primary hover:text-primary"
                )}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl border border-border bg-bg-surface flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 sticky top-0 h-fit">
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => navigate('/knowledge/write')}
            className="w-full h-14 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all shrink-0"
          >
            <Plus size={20} /> 질문하기
          </button>

          {/* Board 2: My Posts (내가 쓴 글) */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <HelpCircle size={16} className="text-primary" /> 내가 쓴 글
              </h4>
              <button 
                onClick={() => { setFilter('내가 쓴 글'); setCurrentPage(1); }}
                className="text-[10px] text-text-muted hover:text-primary font-bold flex items-center gap-0.5 transition-colors"
              >
                전체보기 <ChevronRight size={10} />
              </button>
            </div>
            <div className="space-y-4">
              {mockPosts.filter(p => p.isMy).length > 0 ? (
                mockPosts.filter(p => p.isMy).slice(0, 5).map(p => (
                  <Link key={p.id} to={`/knowledge/post/${p.id}`} className="block group">
                    <div className="p-2 -mx-2 rounded-xl border border-transparent hover:border-border hover:bg-bg-elevated transition-all">
                      <div className="flex items-center gap-2 mb-1.5">
                        {p.isResolved ? (
                          <span className="px-1 py-0.5 rounded text-[8px] font-black bg-success/10 text-success border border-success/20">해결됨</span>
                        ) : (
                          <span className="px-1 py-0.5 rounded text-[8px] font-black bg-warning/10 text-warning border border-warning/20">답변 대기</span>
                        )}
                        <p className="text-xs font-bold text-text-primary group-hover:text-primary truncate flex-1">{p.title}</p>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-text-muted font-medium">
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={10} />
                          <span>{mockComments[p.id as keyof typeof mockComments]?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-text-muted py-2">작성한 글이 없습니다.</p>
              )}
            </div>
          </div>

          {/* Board 3: My Answered Posts (내가 답변한 글) */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <MessageCircle size={16} className="text-primary" /> 내가 답변한 글
              </h4>
              <button 
                onClick={() => { setFilter('내가 답변한 글'); setCurrentPage(1); }}
                className="text-[10px] text-text-muted hover:text-primary font-bold flex items-center gap-0.5 transition-colors"
              >
                전체보기 <ChevronRight size={10} />
              </button>
            </div>
            <div className="space-y-4">
              {myAnsweredPosts.length > 0 ? (
                myAnsweredPosts.slice(0, 5).map(post => (
                  <Link key={post.id} to={`/knowledge/post/${post.id}`} className="block group">
                    <div className="p-2 -mx-2 rounded-xl border border-transparent hover:border-border hover:bg-bg-elevated transition-all">
                      <div className="flex items-center gap-2 mb-1.5">
                        {post.isResolved ? (
                          <span className="px-1 py-0.5 rounded text-[8px] font-black bg-success/10 text-success border border-success/20">해결됨</span>
                        ) : (
                          <span className="px-1 py-0.5 rounded text-[8px] font-black bg-warning/10 text-warning border border-warning/20">답변 대기</span>
                        )}
                        <p className="text-xs font-bold text-text-primary group-hover:text-primary truncate flex-1">{post.title}</p>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-text-muted font-medium">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={10} />
                          <span>{mockComments[post.id as keyof typeof mockComments]?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-text-muted italic">아직 답변한 글이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
