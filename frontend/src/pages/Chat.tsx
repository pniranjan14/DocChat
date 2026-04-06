import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PanelLeftOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { DocumentSidebar } from "@/components/DocumentSidebar";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useAppContext } from "@/context/AppContext";

export default function Chat() {
  const { messages, isSending, handleSendMessage, recentDocs } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const welcomeMessage = {
    id: "welcome",
    role: "assistant" as const,
    content: "👋 Welcome to **DocChat**! Upload a document using the sidebar and ask me anything about it. I'll search through your files using AI-powered retrieval to find the best answers.",
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div className="h-screen flex bg-background">
      <DocumentSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center gap-3 px-4 border-b border-border/50 bg-card/30 backdrop-blur-md">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground h-8 w-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <h1 className="font-semibold text-foreground text-sm">DocChat</h1>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{recentDocs.length} documents loaded</span>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {displayMessages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              role={msg.role === "ai" ? "assistant" : msg.role} 
              content={msg.content} 
              sources={(msg as any).sources} 
            />
          ))}
          {isSending && <TypingIndicator />}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/30">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={handleSendMessage}
              onUploadClick={() => setSidebarOpen(true)}
              disabled={isSending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
