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
import { mockChatRooms, mockMessages, mockAllUsers } from '../../mock/data';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ChatPage = () => {
  const { user } = useAuth(); // ← 최상단으로 이동

  // ✅ 컴포넌트 안으로 이동 + email로 교체
  const initialRooms = mockChatRooms.map((room, idx) => ({
    ...room,
    hostEmail: idx === 0 ? 'suho@company.com' : user?.email,
    participants: [
      { email: user?.email, name: user?.name, role: 'member' },
      { email: 'suho@company.com', name: '이수호 팀장', role: 'member' },
      { email: 'yeji@company.com', name: '정예지 대리', role: 'member' },
    ].map(p => ({
      ...p,
      role: (idx === 0 && p.email === 'suho@company.com') ||
            (idx !== 0 && p.email === user?.email) ? 'host' : 'member'
    })),
    files: [
      { id: 1, name: '프로젝트_명세서.pdf', size: '2.4MB', uploader: '이수호', date: '2025.05.01' },
      { id: 2, name: '디자인_가이드라인.fig', size: '15MB', uploader: '정예지', date: '2025.05.02' },
    ]
  }));

  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<{ id: number; name: string; size: string }[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeRoom = rooms.find(r => r.id === selectedRoomId);
  const isHost = (activeRoom as any)?.hostEmail === user?.email; // ✅ email로 비교

  // mockAllUsers에서 본인 제외 (email 기준)
  const availableUsers = mockAllUsers.filter(u => u.email !== user?.email);

  useEffect(() => {
    if (selectedRoomId && mockMessages[selectedRoomId as keyof typeof mockMessages]) {
      setMessages(mockMessages[selectedRoomId as keyof typeof mockMessages]);
    } else {
      setMessages([]);
    }
  }, [selectedRoomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = {
      id: Date.now(),
      role: 'user',
      name: user?.name,
      content: inputValue,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiMsg = {
      id: Date.now() + 1,
      role: 'ai',
      content: `"${userMsg.content}"에 대해 사내 문서를 기반으로 분석한 결과입니다.\n\n해당 내용은 사내 운영 가이드 제3절에 명시되어 있으며, 구체적인 절차는 가온 포털 내 '업무 지원' 탭에서 확인이 가능합니다.`,
      source: '운영규정_v2.pdf',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleCreateRoom = () => {
    if (!newRoomTitle.trim()) return;

    const participants = [
      { email: user?.email, name: user?.name, role: 'host' },
      ...selectedMembers.map(m => ({ ...m, role: 'member' }))
    ];

    const files = attachedFiles.map(f => ({
      ...f,
      uploader: user?.name,
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '')
    }));

    const newRoom = {
      id: `new-${Date.now()}`,
      title: newRoomTitle,
      createdAt: new Date().toISOString().split('T')[0],
      lastMessage: attachedFiles.length > 0
        ? `${attachedFiles[0].name} 외 ${attachedFiles.length}개의 파일이 업로드되었습니다.`
        : '채팅방이 생성되었습니다.',
      hostEmail: user?.email,
      participants,
      files
    };

    setRooms([newRoom as any, ...rooms]);
    setSelectedRoomId(newRoom.id);
    resetModal();
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setNewRoomTitle('');
    setSelectedMembers([]);
    setAttachedFiles([]);
    setMemberSearch('');
  };

  const toggleMemberSelection = (member: any) => {
    if (selectedMembers.find(m => m.email === member.email)) {
      setSelectedMembers(selectedMembers.filter(m => m.email !== member.email));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file: File) => ({
        id: Math.random(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + 'MB'
      }));
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachedFile = (id: number) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const deleteRoom = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRooms(rooms.filter(r => r.id !== id));
    if (selectedRoomId === id) setSelectedRoomId(null);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-bg-surface border border-border rounded-xl overflow-hidden glass-card relative">
      {/* Create New Room Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">초기 파일 업로드 (선택)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer border-border hover:border-primary/50 hover:bg-bg-elevated flex flex-col items-center justify-center gap-2"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        className="hidden" 
                      />
                      <Paperclip className="text-text-muted" size={24} />
                      <p className="text-xs text-text-secondary font-medium">클릭하거나 파일을 선택하세요 (여러 개 가능)</p>
                    </div>
                    
                    {attachedFiles.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {attachedFiles.map(file => (
                          <div key={file.id} className="flex items-center gap-3 w-full p-2 bg-bg-elevated border border-border rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                              <FileText size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{file.name}</p>
                              <p className="text-[10px] text-text-muted">{file.size}</p>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeAttachedFile(file.id); }}
                              className="p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">멤버 초대</label>
                      <span className="text-[10px] font-bold text-primary">{selectedMembers.length}명 선택됨</span>
                    </div>
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                      <input 
                        type="text"
                        placeholder="이름 또는 부서 검색..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="w-full bg-bg-elevated border border-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {availableUsers
                        .filter(u => u.name.includes(memberSearch) || u.dept.includes(memberSearch))
                        .map(member => {
                          const isSelected = selectedMembers.find(m => m.email === member.email);
                          return (
                            <div 
                              key={member.email}
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
                                  <p className="text-[10px] text-text-muted">{member.dept} • {member.role}</p>
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
                    disabled={!newRoomTitle.trim()}
                    className="flex-[2] btn-primary h-12 rounded-2xl text-sm shadow-xl shadow-primary/20"
                  >
                    대화 시작하기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedRoomId ? (
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
                  <input className="w-full bg-bg-elevated border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" placeholder="채팅방 이름이나 참여자 검색..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => {
                    const roomParticipants = (room as any).participants || [];
                    const host = roomParticipants.find((p: any) => p.role === 'host') || roomParticipants[0];
                    const otherCount = roomParticipants.length - 1;

                    return (
                      <motion.div
                        whileHover={{ y: -4 }}
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className="bg-bg-elevated/50 border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/50 transition-all group relative"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <MessageSquare size={20} />
                          </div>
                          <span className="text-[10px] text-text-muted font-bold">{room.createdAt}</span>
                        </div>
                        <h3 className="text-sm font-bold text-text-primary mb-2 group-hover:text-primary transition-colors truncate">{room.title}</h3>
                        <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed mb-4 h-8">
                          {room.lastMessage || '대화를 시작하여 사내 지식을 탐색해보세요.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-text-secondary font-bold">
                            {host?.name}{otherCount > 0 && ` 외 ${otherCount}명`}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            입장하기 <ChevronRight size={12} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {rooms.length === 0 && (
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
            {/* Left Sidebar: Files */}
            <div className="w-64 border-r border-border bg-bg-surface/50 hidden lg:flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <File size={16} className="text-primary" /> 공유 파일
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {(activeRoom as any).files?.map((file: any) => (
                  <div key={file.id} className="p-3 rounded-lg border border-border bg-bg-elevated/50 hover:bg-bg-elevated transition-colors group">
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-bg-surface border border-border group-hover:border-primary/30 transition-colors">
                        <FileText size={18} className="text-text-secondary group-hover:text-primary" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-text-muted mb-1">{file.date}</span>
                        <button className="p-1 text-text-muted hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] font-medium text-text-primary mt-2 truncate">{file.name}</p>
                  </div>
                ))}
                {(activeRoom as any).files?.length === 0 && (
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
                    onClick={() => setSelectedRoomId(null)}
                    className="p-2 -ml-2 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />
                  <h4 className="text-sm font-bold text-text-primary truncate max-w-[120px] sm:max-w-[400px]">
                    {activeRoom?.title}
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
                  <span className="text-xs font-bold hidden sm:inline">{(activeRoom as any).participants?.length}명</span>
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Sparkles size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">무엇을 도와드릴까요?</h3>
                    <p className="text-xs text-text-muted">사내 지식 베이스를 활용하여 정교한 답변을 드립니다.</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}
                  >
                    {msg.role !== 'user' && (
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-[10px] font-black text-accent tracking-widest uppercase">ASK HUB AI</span>
                      </div>
                    )}
                    <div className={cn(
                      "flex max-w-[90%] lg:max-w-[75%] gap-3",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm mt-1",
                        msg.role === 'user' 
                          ? "bg-primary border-primary/20 text-white" 
                          : "bg-bg-elevated border-border text-accent"
                      )}>
                        {msg.role === 'user' ? <UserIcon size={16} /> : <Sparkles size={16} />}
                      </div>
                      <div className="space-y-2">
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                          msg.role === 'user' 
                            ? "bg-bg-elevated border border-primary/20 text-text-primary rounded-tr-none" 
                            : "bg-primary text-white shadow-lg shadow-primary/20 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                        {msg.source && (
                          <div className="flex items-center gap-2 px-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-bg-surface border border-border text-[10px] text-accent font-bold">
                              <FileText size={10} /> 출처: {msg.source}
                            </span>
                          </div>
                        )}
                        <p className={cn("text-[10px] text-text-muted px-1", msg.role === 'user' ? "text-right" : "text-left")}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
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
                          title={isHost ? "파일 업로드" : "방장만 파일 업로드가 가능합니다"}
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
                        placeholder={isTyping ? "AI가 답변을 준비 중입니다..." : "AI 답변을 맹신하지 마세요. 무엇이든 물어보세요..."}
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

            {/* Right Sidebar: Participants */}
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
                    {(activeRoom as any).participants?.map((p: any) => (
                      <div key={p.email} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated/50 border border-border group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm",
                            p.role === 'host' ? "bg-primary text-white" : "bg-bg-surface text-text-secondary"
                          )}>
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                              {p.name}
                              {p.role === 'host' && (
                                <span className="px-1.5 py-0.5 rounded bg-warning/20 text-warning text-[9px] font-black uppercase tracking-tighter">HOST</span>
                              )}
                            </p>
                          </div>
                        </div>
                        {/* ✅ p.id → p.email로 비교 */}
                        {isHost && p.email !== user?.email && (
                          <button className="p-1.5 text-text-muted hover:text-danger rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border space-y-2">
                    {isHost && (
                      <button 
                        onClick={(e) => deleteRoom(e, activeRoom!.id)}
                        className="w-full h-9 rounded-xl flex items-center justify-center gap-2 bg-danger/10 text-danger hover:bg-danger/20 text-xs font-bold transition-all mb-2"
                      >
                        <Trash2 size={14} /> 방 삭제하기
                      </button>
                    )}
                    <button className="w-full btn-outline h-9 text-xs rounded-xl flex items-center justify-center gap-2">
                      <Plus size={14} /> 참여자 초대하기
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};