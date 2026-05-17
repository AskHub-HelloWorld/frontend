import React, { useState, useEffect } from 'react';
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
import { getPosts, getUnresolvedPosts, getMyPosts, searchPosts, getPostsByCategory } from '../../services/postService';
import type { PostItem, Category } from '../../types/post';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PostCard = ({ post }: { post: PostItem }) => {
  return (
    <Link to={`/knowledge/post/${post.postId}`}>
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
              {post.isMine && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 tracking-wider">MY</span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-bg-elevated text-text-muted text-[10px] font-bold border border-border">
                {post.position}
              </span>
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
            <span className="text-xs font-medium text-text-secondary">{post.writer}</span>
            <span className="text-text-muted mx-1">•</span>
            <span className="text-xs text-text-muted">
              {new Date(post.createdAt).toLocaleDateString()}{' '}
              {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors">
            <MessageSquare size={14} />
            <span className="text-xs font-bold">{post.commentCount}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export const KnowledgePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('전체');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 5;

  const categories: Category[] = ['FRONTEND', 'BACKEND', 'AI', 'DESIGNER', 'FULLSTACK', 'SECURITY', 'UNKNOWN', 'OTHER'];

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const pageable = { page: currentPage - 1, size: itemsPerPage };
      let result;

      if (searchKeyword.trim()) {
        result = await searchPosts(searchKeyword, pageable);
      } else if (filter === '미답변만') {
        result = await getUnresolvedPosts(pageable);
      } else if (filter === '내가 쓴 글') {
        result = await getMyPosts(pageable);
      } else if (selectedCategories.length > 0) {
        result = await getPostsByCategory(selectedCategories[0] as Category, pageable);
      } else {
        result = await getPosts(pageable);
      }

      setPosts(result.content);
      setHasNext(result.hasNext);
    } catch (e) {
      console.error('게시글 로딩 실패', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter, currentPage, searchKeyword, selectedCategories]);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      {/* Main Content Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* 검색창 */}
          <div className="relative w-full h-14">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              className="w-full h-full bg-bg-surface border border-border rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:border-primary focus:shadow-glow transition-all" 
              placeholder="무엇이든 검색해보세요 (예: 연차 정책, 코드 가이드...)"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* 필터 버튼 */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {['전체', '미답변만', '내가 쓴 글'].map(cat => (
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

              {/* 카테고리 드롭다운 */}
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
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => toggleCategory(cat)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                                selectedCategories.includes(cat)
                                  ? "bg-primary text-white"
                                  : "text-text-secondary hover:bg-white/5"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* 선택된 카테고리 태그 */}
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
                    onClick={() => { setSelectedCategories([]); setCurrentPage(1); }}
                    className="p-1 text-text-muted hover:text-danger ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-text-muted">불러오는 중...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-text-muted">게시글이 없습니다.</div>
          ) : (
            posts.map(post => <PostCard key={post.postId} post={post} />)
          )}
        </div>

        {/* 페이지네이션 */}
        {(currentPage > 1 || hasNext) && (
          <div className="flex items-center justify-center gap-2 pt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl border border-border bg-bg-surface flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <span className="text-sm font-bold text-text-primary px-4">{currentPage} 페이지</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
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

          {/* 내가 쓴 글 */}
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
              {user?.myPostList && user.myPostList.length > 0 ? (
                user.myPostList.slice(0, 5).map((p, index) => (
                  <div key={index} className="block group">
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
                          <span>{p.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted py-2">작성한 글이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 내가 답변한 글 - comment API 구현 후 연동 예정 */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <MessageCircle size={16} className="text-primary" /> 내가 답변한 글
              </h4>
            </div>
            <div className="py-4 text-center">
              <p className="text-xs text-text-muted italic">아직 답변한 글이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};