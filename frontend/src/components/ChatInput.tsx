import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  onUploadClick: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onUploadClick, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-3 flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onUploadClick}
        className="text-muted-foreground hover:text-primary shrink-0"
      >
        <Paperclip className="w-5 h-5" />
      </Button>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your documents..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
      />

      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        className="shrink-0 rounded-lg"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
