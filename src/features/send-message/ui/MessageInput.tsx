'use client';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-background flex items-center gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишите сообщение..."
        className="flex-1 rounded-full bg-muted/50"
      />
      <Button
        type="submit"
        disabled={!text.trim()}
        size="icon"
        className="rounded-full shrink-0"
      >
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
        </svg>
      </Button>
    </form>
  );
}
