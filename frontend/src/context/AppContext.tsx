import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api";

interface Document {
  id: string;
  file_name: string;
  file?: string;
  upload_date: string;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "ai";
  content: string;
  sources?: string[];
}

interface AppContextType {
  session: any;
  messages: Message[];
  recentDocs: Document[];
  activeDocId: string | null;
  isUploading: boolean;
  isSending: boolean;
  handleFileUpload: (file: File) => Promise<void>;
  handleSendMessage: (query: string) => Promise<void>;
  switchDocument: (docId: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Helper to load a session by its linked document ID
  const loadSessionForDoc = async (docId: string) => {
    try {
      const sessRes = await axios.get(`${API_BASE}/sessions/`);
      let docSession = sessRes.data.find((s: any) => 
        s.document && String(s.document.id || s.document) === String(docId)
      );
      
      if (!docSession) {
        // Create session on the fly if it doesn't exist
        const doc = recentDocs.find(d => String(d.id) === String(docId));
        const newSessRes = await axios.post(`${API_BASE}/sessions/`, {
          title: doc ? doc.file_name : "Document Analysis",
          document: docId
        });
        docSession = newSessRes.data;
      }

      setSession(docSession);
      setMessages(docSession.messages || []);
    } catch (err) {
      console.error("Failed to load session for doc", err);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        const docsRes = await axios.get(`${API_BASE}/documents/`);
        setRecentDocs(docsRes.data);
        
        if (docsRes.data.length > 0) {
          const firstDoc = docsRes.data[0];
          setActiveDocId(firstDoc.id);
          await loadSessionForDoc(firstDoc.id);
        } else {
          // If no documents, just load a general session or keep empty
          const sessRes = await axios.get(`${API_BASE}/sessions/`);
          if (sessRes.data.length > 0) {
            setSession(sessRes.data[0]);
            setMessages(sessRes.data[0].messages || []);
          }
        }
      } catch (err) {
        console.error("Initialization failed", err);
      }
    };
    initApp();
  }, []);

  const switchDocument = async (docId: string) => {
    setActiveDocId(docId);
    await loadSessionForDoc(docId);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/documents/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setRecentDocs(prev => [res.data, ...prev]);
      setActiveDocId(res.data.id);
      
      // Wait a moment for the backend to finish session creation if async (though it's sync here)
      // Re-fetch sessions to find the one just created for this document
      setTimeout(async () => {
        await loadSessionForDoc(res.data.id);
      }, 500);
      
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (query: string) => {
    if (!query.trim() || !session || isSending) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await axios.post(`${API_BASE}/sessions/${session.id}/chat/`, { 
        message: query,
        doc_id: activeDocId 
      });
      const aiMsg: Message = { 
        id: res.data.id || crypto.randomUUID(), 
        role: "assistant", 
        content: String(res.data.content || ""), 
        sources: res.data.sources || [] 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: crypto.randomUUID(),
        role: "assistant", 
        content: "Error communicating with the backend. Please check the server status.", 
        sources: [] 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppContext.Provider value={{
      session,
      messages,
      recentDocs,
      activeDocId,
      isUploading,
      isSending,
      handleFileUpload,
      handleSendMessage,
      switchDocument,
      setMessages
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
