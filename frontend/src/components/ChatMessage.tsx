import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: any[];
}

export function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div className={`max-w-[75%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "glass-card rounded-tl-sm"
          }`}
        >
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{String(content || "")}</ReactMarkdown>
          </div>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 ml-1">
              Referenced from
            </p>
            <div className="flex flex-wrap gap-2">
              {sources.map((src, i) => (
                <div 
                  key={i} 
                  className="group flex items-center gap-2 bg-secondary/20 hover:bg-secondary/40 border border-white/5 rounded-full py-1.5 px-3 transition-all duration-200 cursor-default"
                >
                  <span className="text-[10px] font-bold text-primary whitespace-nowrap">
                    PAGE {src.page !== undefined ? src.page + 1 : i + 1}
                  </span>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <p className="text-[11px] text-muted-foreground/80 line-clamp-1 max-w-[200px] italic">
                    {src.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
