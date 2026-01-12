"use client";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { useStaffChat } from "@/hooks/useStaffChat";

export default function StaffChatPage() {
  const {
    user,
    loading,
    themeMode,
    backgroundStyle,
    baseTextColor,
    selectedRoomId,
    selectedRoomName,
    messages,
    newMessage,
    setNewMessage,
    members,
    activeTab,
    setActiveTab,
    scrollRef,
    handleSendMessage,
    handleSelectDM,
    handleSelectRoom,
    GROUP_ROOMS
  } = useStaffChat();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand">LOADING...</div>;

  return (
    <div 
      className={`flex h-screen w-full font-sans overflow-hidden ${baseTextColor}`}
      style={backgroundStyle}
    >
      
      {/* サイドバー */}
      <StaffSidebar />
      
      {/* メインエリア */}
      <main className="flex-1 flex h-full overflow-hidden relative">
        
        {/* 左カラム：ルームリスト */}
        <div className={`w-64 border-r border-brand/20 flex flex-col z-10 shrink-0 backdrop-blur-sm ${themeMode === 'dark' ? 'bg-black/40' : 'bg-white/60'}`}>
          <div className="p-4 border-b border-brand/20">
            <h1 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-brand">💬</span> Chat
            </h1>
          </div>

          <div className="flex p-2 gap-2">
            <button 
              onClick={() => setActiveTab('groups')} 
              className={`flex-1 py-1 text-xs font-bold rounded transition 
                ${activeTab === 'groups' 
                  ? 'bg-brand text-black shadow-lg shadow-brand/20' 
                  : 'text-slate-400 hover:text-brand hover:bg-brand/10'
                }`}
            >
              GROUPS
            </button>
            <button 
              onClick={() => setActiveTab('direct')} 
              className={`flex-1 py-1 text-xs font-bold rounded transition 
                ${activeTab === 'direct' 
                  ? 'bg-brand text-black shadow-lg shadow-brand/20' 
                  : 'text-slate-400 hover:text-brand hover:bg-brand/10'
                }`}
            >
              DIRECT
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {activeTab === 'groups' && GROUP_ROOMS.map(room => (
              <button 
                key={room.id} 
                onClick={() => handleSelectRoom(room)} 
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 
                  ${selectedRoomId === room.id 
                    ? 'bg-brand/20 text-brand border border-brand/30' 
                    : 'text-slate-400 hover:bg-brand/5 hover:text-brand'
                  }`}
              >
                {room.name}
              </button>
            ))}
            {activeTab === 'direct' && members.map(member => (
              <button 
                key={member.id} 
                onClick={() => handleSelectDM(member)} 
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-3 
                  ${selectedRoomName === member.name 
                    ? 'bg-brand/20 text-brand border border-brand/30' 
                    : 'text-slate-400 hover:bg-brand/5 hover:text-brand'
                  }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {member.icon}
                </div>
                {member.name}
              </button>
            ))}
          </div>
        </div>

        {/* 右カラム：チャットエリア */}
        <div className="flex-1 flex flex-col z-10 min-w-0 bg-transparent">
          <header className={`h-16 border-b border-brand/20 backdrop-blur flex items-center px-6 justify-between shrink-0 ${themeMode === 'dark' ? 'bg-black/20' : 'bg-white/40'}`}>
            <div className={`font-bold flex items-center gap-2 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-brand text-lg">{activeTab === 'groups' ? '#' : '@'}</span>
              {selectedRoomName}
            </div>
          </header>

          {/* メッセージ表示エリア */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-brand/30 select-none">
                <p className="text-4xl mb-4 opacity-50">📨</p>
                <p>No messages yet.</p>
                <p className="text-sm mt-2">Send a message to start scrolling!</p>
              </div>
            )}

            {messages.map((msg) => {
              const isMe = msg.senderId === user?.uid;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-lg ${isMe ? "bg-brand text-black" : "bg-slate-700 text-white"}`}>
                      {msg.senderName.charAt(0)}
                    </div>
                    
                    <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-md break-words whitespace-pre-wrap 
                      ${isMe 
                        ? "bg-brand text-black rounded-tr-none shadow-brand/20" 
                        : themeMode === 'dark' 
                          ? "bg-brand-dim border border-brand/20 text-slate-200 rounded-tl-none" 
                          : "bg-white border border-brand/20 text-slate-800 rounded-tl-none shadow-sm"
                      }
                    `}>
                      {msg.text}
                    </div>
                  </div>
                  <div className={`text-[9px] text-slate-500 mt-1 opacity-60 ${isMe ? "text-right mr-1" : "ml-1"}`}>
                    {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* 入力エリア */}
          <div className={`p-4 border-t border-brand/20 backdrop-blur shrink-0 ${themeMode === 'dark' ? 'bg-black/60' : 'bg-white/60'}`}>
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
              <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type a message..."
                className={`flex-1 border rounded-full px-5 py-3 focus:border-brand outline-none transition shadow-inner
                  ${themeMode === 'dark' 
                    ? 'bg-brand-dim border-brand/30 text-white placeholder-slate-500' 
                    : 'bg-white border-brand/30 text-slate-800 placeholder-slate-400'
                  }`}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()} 
                className="bg-brand hover:brightness-110 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition transform active:scale-95 shrink-0"
              >
                ➤
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}