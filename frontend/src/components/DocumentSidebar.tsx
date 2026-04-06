import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

interface DocumentSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DocumentSidebar({ isOpen, onToggle }: DocumentSidebarProps) {
  const { recentDocs, handleFileUpload, isUploading, switchDocument, activeDocId } = useAppContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
  });

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full border-r border-border bg-card/40 backdrop-blur-xl flex flex-col overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between border-b border-border/50">
            <h2 className="font-semibold text-foreground text-sm">Documents</h2>
            <Button variant="ghost" size="icon" onClick={onToggle} className="text-muted-foreground hover:text-foreground h-7 w-7">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Upload zone */}
          <div className="p-3">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/40 hover:bg-secondary/30"
              } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />
              <Upload className={`w-6 h-6 mx-auto mb-2 ${isUploading ? "animate-bounce text-primary" : "text-muted-foreground"}`} />
              <p className="text-xs text-muted-foreground">
                {isUploading ? "Ingesting..." : isDragActive ? "Drop files here" : "Drag & drop or click"}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOCX, TXT</p>
            </div>
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {recentDocs.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => switchDocument(doc.id)}
                className={`group flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                  activeDocId === doc.id ? "bg-primary/20 border border-primary/30" : "hover:bg-secondary/50"
                }`}
              >
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{doc.file_name || "Untitled Document"}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : "Unknown Date"}
                  </p>
                </div>
              </motion.div>
            ))}
            {recentDocs.length === 0 && (
              <div className="text-center p-10 text-muted-foreground text-xs">
                No documents uploaded yet.
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
