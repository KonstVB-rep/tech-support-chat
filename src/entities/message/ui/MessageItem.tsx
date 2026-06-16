interface MessageProps {
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}

export default function MessageItem({ text, sender, timestamp }: MessageProps) {
  const isUser = sender === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-muted text-foreground rounded-bl-none border border-border'
      }`}>
        <p className="text-sm break-words whitespace-pre-wrap">{text}</p>
        <span className={`text-[10px] block text-right mt-1 ${
          isUser ? 'text-blue-200' : 'text-muted-foreground'
        }`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}