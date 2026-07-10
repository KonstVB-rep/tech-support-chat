// src/entities/message/ui/MessageItem.tsx
"use client";

interface MessageProps {
  text: string;
  sender: "user" | "support" | "admin"; 
  timestamp: string;
}

export default function MessageItem({ text, sender, timestamp }: MessageProps) {
  const isUser = sender === 'user';

  return (
    <div className={`flex w-full mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-2 flex flex-col min-w-[80px] shadow-sm select-text ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-muted text-foreground rounded-bl-none border border-border/60'
      }`}>

        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed pr-2">
          {text}
        </p>
        
        <span className={`text-[9px] font-medium tracking-wide self-end mt-1 select-none leading-none ${
          isUser ? 'text-blue-200/90' : 'text-muted-foreground/80'
        }`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}
