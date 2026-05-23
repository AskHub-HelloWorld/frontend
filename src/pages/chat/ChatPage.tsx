import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Send, 
  Paperclip, 
  FileText, 
  Bot, 
  User as UserIcon,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Users,
  File,
  Shield,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { getSessions, getMessages, sendMessage, deleteSession } from '../../services/sessionService';
import { createTeam, getTeamDetail, downloadConvention, addConvention, deleteConvention } from '../../services/teamService';
import { searchUsersByCompany } from '../../services/userService';
import type { SessionItem, MessageItem } from '../../types/session';
import type { UserSearchItem } from '../../types/user';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ChatPage = () => {
  const { user } = useAuth();

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [teamDetail, setTeamDetail] = useState<any>(null);

  // 새 채팅방 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<UserSearchItem[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState<UserSearchItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  //참여자 추가 상태
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteMembers, setInviteMembers] = useState<UserSearchItem[]>([]);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteUsers, setInviteUsers] = useState<UserSearchItem[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [isSearchingInviteUsers, setIsSearchingInviteUsers] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conventionFileRef = useRef<HTMLInputElement>(null);

  const isHost = teamDetail?.captainName === user?.name;

  // 세션 목록 조회
  const fetchSessions = async (keyword?: string) => {
    setIsSessionLoading(true);
    try {
      let result;
      if (keyword?.trim()) {
        const { searchSessions } = await import('../../services/sessionService');
        result = await searchSessions(keyword, { page: 0, size: 20 });
      } else {
        result = await getSessions({ page: 0, size: 20 });
      }
      setSessions(result.content);
    } catch {
      console.error('세션 목록 로딩 실패');
    } finally {
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 메시지 + 팀 상세 조회
  useEffect(() => {
    if (!selectedSession) return;

    const fetchMessages = async () => {
      try {
        const result = await getMessages(selectedSession.sessionId, { page: 0, size: 50 });
        setMessages(result.content);
      } catch {
        console.error('메시지 로딩 실패');
      }
    };

    const fetchTeamDetail = async () => {
      try {
        const detail = await getTeamDetail(selectedSession.teamId);
        setTeamDetail(detail);
      } catch {
        console.error('팀 정보 로딩 실패');
      }
    };

    fetchMessages();
    fetchTeamDetail();
  }, [selectedSession]);

  // 스크롤 최하단
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // 메시지 전송
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedSession) return;

    // 임시 유저 메시지 (낙관적 업데이트)
    const tempUserMsg: MessageItem = {
      response: {
        messageId: Date.now(),
        content: inputValue,
        role: 'ASKER',
      }
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      await sendMessage({
        sessionId: selectedSession.sessionId,
        teamId: selectedSession.teamId,
        message: inputValue,
      });

      // 전송 후 메시지 목록 새로고침
      const result = await getMessages(selectedSession.sessionId, { page: 0, size: 50 });
      setMessages(result.content);
    } catch (error) {
      console.error('메시지 전송 실패', error);
    } finally {
      setIsTyping(false);
    }
  };

  // 멤버 검색
  useEffect(() => {
    if (!isModalOpen || !user?.company) return;

    const fetchUsers = async () => {
      setIsSearchingUsers(true);
      try {
        const result = await searchUsersByCompany(user.company);
        const filtered = result.userList.filter(u => u.name !== user.name);
        setAvailableUsers(
          memberSearch.trim()
            ? filtered.filter(u => u.name.includes(memberSearch))
            : filtered
        );
      } catch {
        console.error('유저 검색 실패');
      } finally {
        setIsSearchingUsers(false);
      }
    };

    fetchUsers();
  }, [isModalOpen, memberSearch]);

  //초대 유저 검색
  useEffect(() => {
  if (!isInviteModalOpen || !user?.company) return;

  const fetchInviteUsers = async () => {
    setIsSearchingInviteUsers(true);
    try {
      const result = await searchUsersByCompany(user.company);
      // 이미 참여 중인 팀원 제외
      const alreadyIn = teamDetail?.userNameList || [];
      const filtered = result.userList.filter(
        u => u.name !== user.name && !alreadyIn.includes(u.name)
      );
      setInviteUsers(
        inviteSearch.trim()
          ? filtered.filter(u => u.name.includes(inviteSearch))
          : filtered
      );
    } catch {
      console.error('유저 검색 실패');
    } finally {
      setIsSearchingInviteUsers(false);
    }
  };

  fetchInviteUsers();
}, [isInviteModalOpen, inviteSearch]);

  // 팀 생성
  const handleCreateRoom = async () => {
    if (!newRoomTitle.trim()) return;
    setIsCreating(true);
    try {
      const userIds = selectedMembers.map(m => m.userId);
      const { teamId, sessionId } = await createTeam(
        newRoomTitle,
        userIds,
        attachedFiles.length > 0 ? attachedFiles : undefined
      );

      await fetchSessions();

      const newSession: SessionItem = {
        teamId,
        sessionId,
        teamName: newRoomTitle,
        messagePreview: '채팅방이 생성되었습니다.',
        captainName: user?.name || '',
      };
      setSelectedSession(newSession);
      resetModal();
    } catch {
      alert('채팅방 생성에 실패했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  // 세션 삭제
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: number) => {
    e.stopPropagation();
    if (!confirm('채팅방을 삭제하시겠습니까?')) return;
    try {
      await deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      if (selectedSession?.sessionId === sessionId) setSelectedSession(null);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  //참여자 추가
  const handleInvite = async () => {
  if (!selectedSession || inviteMembers.length === 0) return;
  setIsInviting(true);
  try {
    const { inviteUsers: inviteAPI } = await import('../../services/teamService');
    await inviteAPI({
      teamId: selectedSession.teamId,
      userIds: inviteMembers.map(m => m.userId),
    });
    // 팀 정보 새로고침
    const detail = await getTeamDetail(selectedSession.teamId);
    setTeamDetail(detail);
    setIsInviteModalOpen(false);
    setInviteMembers([]);
    setInviteSearch('');
  } catch {
    alert('초대에 실패했습니다.');
  } finally {
    setIsInviting(false);
  }
};

  // 컨벤션 파일 추가
  const handleAddConvention = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedSession || !e.target.files?.length) return;
    try {
      const files = Array.from(e.target.files);
      await addConvention(selectedSession.teamId, files);
      const detail = await getTeamDetail(selectedSession.teamId);
      setTeamDetail(detail);
    } catch {
      alert('파일 업로드에 실패했습니다.');
    }
  };

  // 컨벤션 파일 다운로드
  const handleDownloadConvention = async (conventionId: number) => {
    try {
      const url = await downloadConvention(conventionId);
      window.open(url);
    } catch {
      alert('다운로드에 실패했습니다.');
    }
  };

  // 컨벤션 파일 삭제
  const handleDeleteConvention = async (conventionId: number) => {
    if (!selectedSession) return;
    if (!confirm('파일을 삭제하시겠습니까?')) return;
    try {
      await deleteConvention(selectedSession.teamId, conventionId);
      const detail = await getTeamDetail(selectedSession.teamId);
      setTeamDetail(detail);
    } catch {
      alert('파일 삭제에 실패했습니다.');
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setNewRoomTitle('');
    setSelectedMembers([]);
    setAttachedFiles([]);
    setMemberSearch('');
    setAvailableUsers([]);
  };

  //채팅방 참여자 추가하기
  

  const toggleMemberSelection = (member: UserSearchItem) => {
    if (selectedMembers.find(m => m.userId === member.userId)) {
      setSelectedMembers(prev => prev.filter(m => m.userId !== member.userId));
    } else {
      setSelectedMembers(prev => [...prev, member]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-bg-surface border border-border rounded-xl overflow-hidden glass-card relative">
      {/* 새 채팅방 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={resetModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">새 채팅방 설정</h3>
                    <p className="text-xs text-text-muted mt-1">협업을 위한 방 정보와 참여자를 설정하세요</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 채팅방 이름 */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">채팅방 이름</label>
                    <input 
                      autoFocus
                      type="text" 
                      value={newRoomTitle}
                      onChange={(e) => setNewRoomTitle(e.target.value)}
                      placeholder="예: 사내 지식 공유 TF, 디자인 리뷰..."
                      className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  {/* 초기 파일 업로드 */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">초기 파일 업로드 (선택)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer border-border hover:border-primary/50 hover:bg-bg-elevated flex flex-col items-center justify-center gap-2"
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                      <Paperclip className="text-text-muted" size={24} />
                      <p className="text-xs text-text-secondary font-medium">클릭하거나 파일을 선택하세요</p>
                    </div>
                    {attachedFiles.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {attachedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3 w-full p-2 bg-bg-elevated border border-border rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                              <FileText size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{file.name}</p>
                              <p className="text-[10px] text-text-muted">{(file.size / (1024 * 1024)).toFixed(1)}MB</p>
                            </div>
                            <button 
                              onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 멤버 초대 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">멤버 초대</label>
                      <span className="text-[10px] font-bold text-primary">{selectedMembers.length}명 선택됨</span>
                    </div>
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                      <input 
                        type="text"
                        placeholder="이름 검색..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="w-full bg-bg-elevated border border-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                      {isSearchingUsers && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {availableUsers.map(member => {
                        const isSelected = selectedMembers.find(m => m.userId === member.userId);
                        return (
                          <div 
                            key={member.userId}
                            onClick={() => toggleMemberSelection(member)}
                            className={cn(
                              "p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group",
                              isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-bg-elevated border-border hover:bg-bg-elevated/80"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white",
                                isSelected ? "bg-primary text-white" : "bg-bg-surface text-text-secondary"
                              )}>
                                {member.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[12px] font-bold">{member.name}</p>
                                <p className="text-[10px] text-text-muted">{member.position}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                              isSelected ? "bg-primary border-primary" : "border-border bg-white"
                            )}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-3">
                  <button onClick={resetModal} className="flex-1 btn-outline h-12 rounded-2xl text-sm">취소</button>
                  <button 
                    onClick={handleCreateRoom}
                    disabled={!newRoomTitle.trim() || isCreating}
                    className="flex-[2] btn-primary h-12 rounded-2xl text-sm shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    {isCreating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : '대화 시작하기'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedSession ? (
          <motion.div 
            key="room-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">AI 채팅</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary h-10 px-4 text-xs shadow-md shadow-primary/20"
                >
                  <Plus size={18} /> 새 채팅방 만들기
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    className="w-full bg-bg-elevated border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-all"
                    placeholder="채팅방 이름 검색..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      fetchSessions(e.target.value);
                    }}
                  />
                </div>

                {isSessionLoading ? (
                  <div className="text-center py-20 text-text-muted text-sm">불러오는 중...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                      <motion.div
                        whileHover={{ y: -4 }}
                        key={session.sessionId}
                        onClick={() => setSelectedSession(session)}
                        className="bg-bg-elevated/50 border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/50 transition-all group relative"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <MessageSquare size={20} />
                          </div>
                          {session.captainName === user?.name && (
                            <button
                              onClick={(e) => handleDeleteSession(e, session.sessionId)}
                              className="p-1.5 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-text-primary mb-2 group-hover:text-primary transition-colors truncate">
                          {session.teamName}
                        </h3>
                        <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed mb-4 h-8">
                          {session.messagePreview || '대화를 시작하여 사내 지식을 탐색해보세요.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-text-secondary font-bold">{session.captainName}</p>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            입장하기 <ChevronRight size={12} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!isSessionLoading && sessions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                    <MessageSquare size={48} className="mb-4 text-text-muted" />
                    <p className="text-sm text-text-muted">채팅 내역이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="active-chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex overflow-hidden lg:h-full h-full"
          >
            {/* Left Sidebar: 컨벤션 파일 */}
            <div className="w-64 border-r border-border bg-bg-surface/50 hidden lg:flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <File size={16} className="text-primary" /> 공유 파일
                </h3>
                {isHost && (
                  <button
                    onClick={() => conventionFileRef.current?.click()}
                    className="p-1 text-text-muted hover:text-primary transition-colors"
                    title="파일 추가"
                  >
                    <Plus size={16} />
                    <input type="file" ref={conventionFileRef} onChange={handleAddConvention} className="hidden" />
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {teamDetail?.conventionIds?.length > 0 ? (
                  teamDetail.conventionIds.map((conventionId: number) => (
                    <div key={conventionId} className="p-3 rounded-lg border border-border bg-bg-elevated/50 hover:bg-bg-elevated transition-colors group">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-bg-surface border border-border group-hover:border-primary/30 transition-colors">
                          <FileText size={18} className="text-text-secondary group-hover:text-primary" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <button
                            onClick={() => handleDownloadConvention(conventionId)}
                            className="p-1 text-text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Download size={14} />
                          </button>
                          {isHost && (
                            <button
                              onClick={() => handleDeleteConvention(conventionId)}
                              className="p-1 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-text-primary mt-2 truncate">
                        파일 #{conventionId}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center opacity-30">
                    <File size={32} className="mx-auto mb-2" />
                    <p className="text-[10px]">공유된 파일이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Chat Interface */}
            <div className="flex-1 flex flex-col bg-bg-base/30 relative">
              <div className="h-16 px-4 border-b border-border flex items-center justify-between bg-bg-surface shadow-sm z-20">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setSelectedSession(null); setTeamDetail(null); setMessages([]); }}
                    className="p-2 -ml-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />
                  <h4 className="text-sm font-bold text-text-primary truncate max-w-[120px] sm:max-w-[400px]">
                    {selectedSession.teamName}
                  </h4>
                </div>
                <button 
                  onClick={() => setShowParticipants(!showParticipants)}
                  className={cn(
                    "p-2 rounded-lg transition-all flex items-center gap-2",
                    showParticipants ? "bg-primary/20 text-primary" : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                  )}
                >
                  <Users size={20} />
                  <span className="text-xs font-bold hidden sm:inline">
                    {teamDetail?.userNameList?.length ?? 0}명
                  </span>
                </button>
              </div>

              {/* 메시지 목록 */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
                {messages.length === 0 && !isTyping && (
                  <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">무엇을 도와드릴까요?</h3>
                    <p className="text-xs text-text-muted">공유 파일을 활용하여 AI가 답변을 드립니다.</p>
                  </div>
                )}

                {/* ✅ response 중첩 구조로 수정 */}
                {messages.map((msg) => {
                  const isUserMsg = msg.response.role === 'ASKER';
                  const content = msg.response.content;
                  const messageId = msg.response.messageId;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={messageId}
                      className={cn("flex flex-col", isUserMsg ? "items-end" : "items-start")}
                    >
                      {!isUserMsg && (
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <span className="text-[10px] font-black text-accent tracking-widest uppercase">ASK HUB AI</span>
                        </div>
                      )}
                      <div className={cn(
                        "flex max-w-[90%] lg:max-w-[75%] gap-3",
                        isUserMsg ? "flex-row-reverse" : "flex-row"
                      )}>
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm mt-1",
                          isUserMsg
                            ? "bg-primary border-primary/20 text-white"
                            : "bg-bg-elevated border-border text-accent"
                        )}>
                          {isUserMsg ? <UserIcon size={16} /> : <Sparkles size={16} />}
                        </div>
                        <div className="space-y-2">
                          <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            isUserMsg
                              ? "bg-bg-elevated border border-primary/20 text-text-primary rounded-tr-none whitespace-pre-wrap"
                              : "bg-primary text-white shadow-lg shadow-primary/20 rounded-tl-none"
                          )}>
                            {isUserMsg ? (
                              content
                            ) : (
                              // ✅ AI 메시지만 마크다운 렌더링
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                  li: ({ children }) => <li className="mb-1">{children}</li>,
                                  code: ({ children }) => (
                                    <code className="bg-white/20 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                  ),
                                  pre: ({ children }) => (
                                    <pre className="bg-white/20 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2">{children}</pre>
                                  ),
                                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                }}
                              >
                                {content}
                              </ReactMarkdown>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-accent">
                      <Bot size={16} className="animate-pulse" />
                    </div>
                    <div className="bg-bg-elevated border border-border p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5 h-12 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* 입력창 */}
              <div className="p-4 lg:p-6 bg-gradient-to-t from-bg-base to-transparent sticky bottom-0">
                <div className="max-w-4xl mx-auto">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative glass-card border-border-light bg-bg-elevated/80 backdrop-blur-md rounded-2xl p-2.5 flex items-end gap-2 shadow-2xl">
                      <div className="relative">
                        <button 
                          className={cn(
                            "p-2.5 rounded-xl transition-all",
                            isHost ? "text-text-muted hover:text-primary hover:bg-primary/10" : "text-text-muted/30 cursor-not-allowed"
                          )}
                          title={isHost ? "파일 업로드" : "파일 업로드는 방장만 가능합니다"}
                        >
                          <Paperclip size={20} />
                          {!isHost && <Shield size={10} className="absolute bottom-1 right-1 text-danger" />}
                        </button>
                      </div>
                      <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        className="flex-1 bg-transparent border-none focus:ring-0 p-2.5 text-sm max-h-32 min-h-[44px] resize-none text-text-primary scrollbar-hide"
                        placeholder={isTyping ? "AI가 답변을 준비 중입니다..." : "AI에게 무엇이든 물어보세요"}
                        disabled={isTyping}
                      />
                      <div className="flex items-center gap-2 p-1">
                        <button 
                          onClick={handleSend}
                          disabled={!inputValue.trim() || isTyping}
                          className={cn(
                            "w-10 h-10 rounded-xl transition-all flex items-center justify-center",
                            inputValue.trim() ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-bg-surface text-text-muted cursor-not-allowed"
                          )}
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 px-2 flex items-center gap-1.5 text-text-muted">
                      <Shield size={12} className="shrink-0" />
                      <p className="text-[10px] font-medium">
                        AI는 정보를 오인하거나 실수할 수 있으므로, 제안된 답변의 정확성을 반드시 재확인하시기 바랍니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar: 참여자 */}
            <AnimatePresence>
              {showParticipants && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-border bg-bg-surface/50 flex flex-col overflow-hidden"
                >
                  <div className="p-6 border-b border-border">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Users size={18} className="text-primary" /> 참여자 목록
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {teamDetail?.userNameList?.map((name: string) => (
                      <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated/50 border border-border group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm",
                            name === teamDetail.captainName ? "bg-primary text-white" : "bg-bg-surface text-text-secondary"
                          )}>
                            {name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                              {name}
                              {name === teamDetail.captainName && (
                                <span className="px-1.5 py-0.5 rounded bg-warning/20 text-warning text-[9px] font-black uppercase tracking-tighter">HOST</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border space-y-2">
                    {isHost && (
                      <button 
                        onClick={(e) => handleDeleteSession(e, selectedSession.sessionId)}
                        className="w-full h-9 rounded-xl flex items-center justify-center gap-2 bg-danger/10 text-danger hover:bg-danger/20 text-xs font-bold transition-all mb-2"
                      >
                        <Trash2 size={14} /> 방 삭제하기
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (isHost) {
                          setIsInviteModalOpen(true);
                        }
                      }}
                      disabled={!isHost}
                      className={cn(
                        "w-full h-9 text-xs rounded-xl flex items-center justify-center gap-2 transition-all",
                        isHost
                          ? "btn-outline hover:border-primary hover:text-primary"
                          : "bg-bg-elevated text-text-muted/40 border border-border cursor-not-allowed opacity-60"
                      )}
                      title={isHost ? "참여자 초대" : "방장만 참여자를 초대할 수 있습니다"}
                    >
                      <Plus size={14} />
                      참여자 초대하기

                      {!isHost && (
                        <Shield size={10} className="text-danger" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
              {/* 참여자 초대 모달 */}
<AnimatePresence>
  {isInviteModalOpen && (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setIsInviteModalOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">참여자 초대</h3>
              <p className="text-xs text-text-muted mt-0.5">팀에 새 멤버를 초대하세요</p>
            </div>
          </div>

          {/* 검색 */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input
              type="text"
              placeholder="이름 검색..."
              value={inviteSearch}
              onChange={(e) => setInviteSearch(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
            />
            {isSearchingInviteUsers && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* 선택된 인원 수 */}
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">멤버 목록</span>
            <span className="text-[10px] font-bold text-primary">{inviteMembers.length}명 선택됨</span>
          </div>

          {/* 유저 목록 */}
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1 mb-6">
            {inviteUsers.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">초대할 수 있는 멤버가 없습니다.</p>
            ) : (
              inviteUsers.map(member => {
                const isSelected = inviteMembers.find(m => m.userId === member.userId);
                return (
                  <div
                    key={member.userId}
                    onClick={() => {
                      if (isSelected) {
                        setInviteMembers(prev => prev.filter(m => m.userId !== member.userId));
                      } else {
                        setInviteMembers(prev => [...prev, member]);
                      }
                    }}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                      isSelected ? "bg-primary/10 border-primary" : "bg-bg-elevated border-border hover:bg-bg-elevated/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                        isSelected ? "bg-primary text-white" : "bg-bg-surface text-text-secondary"
                      )}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{member.name}</p>
                        <p className="text-[10px] text-text-muted">{member.position}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                      isSelected ? "bg-primary border-primary" : "border-border bg-white"
                    )}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={() => { setIsInviteModalOpen(false); setInviteMembers([]); setInviteSearch(''); }}
              className="flex-1 btn-outline h-11 rounded-2xl text-sm"
            >
              취소
            </button>
            <button
              onClick={handleInvite}
              disabled={inviteMembers.length === 0 || isInviting}
              className="flex-[2] btn-primary h-11 rounded-2xl text-sm disabled:opacity-50"
            >
              {isInviting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : `${inviteMembers.length}명 초대하기`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};