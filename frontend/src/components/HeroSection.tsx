import { motion } from "framer-motion";
import { FileText, Zap, Brain, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  { icon: FileText, title: "Upload Any Doc", desc: "PDF, DOCX, TXT — drop it in and go" },
  { icon: Brain, title: "AI-Powered RAG", desc: "LangChain + FAISS vector search" },
  { icon: Zap, title: "Instant Answers", desc: "Context-aware responses in seconds" },
  { icon: Shield, title: "Private & Secure", desc: "Your documents stay on your server" },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden gradient-mesh">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm text-muted-foreground"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          Powered by LangChain & FAISS
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          <span className="text-gradient glow-text">DocChat</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Chat with your documents in seconds.
        </p>

        <div className="flex items-center justify-center mb-20">
          <Button
            size="lg"
            onClick={() => navigate("/chat")}
            className="text-lg px-10 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </Button>
        </div>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full relative z-10"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="glass-card p-6 hover:border-primary/30 transition-all group cursor-default"
          >
            <f.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
