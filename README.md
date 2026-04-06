# DocChat - **Chat with your documents in seconds.**

DocChat is a premium AI-powered document intelligence suite that allows you to upload any document (PDF, DOCX, TXT) and have a persistent, context-aware conversation with it. Built with a "Midnight Elite" aesthetic, it leverages high-speed Retrieval-Augmented Generation (RAG) to provide precise answers instantly.

## 🚀 Features

- **Document-Centric Chat**: Isolated, persistent chat sessions for every document you upload.
- **AI-Powered RAG**: Uses LangChain and FAISS for efficient vector searching and context retrieval.
- **Lightning Fast**: Powered by high-speed AI engines (Groq/OpenAI) for near-instant responses.
- **Modern UI**: A sleek, glassmorphic "Midnight Elite" design system built with React, Tailwind CSS, and Framer Motion.
- **Privacy First**: Secure document ingestion and localized analysis patterns.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, TypeScript, Framer Motion, Lucide Icons.
- **Backend**: Django, Django Rest Framework.
- **AI/ML**: Groq, OpenAI, FAISS, Sentence Transformers.

## 🏁 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.x
- API Keys for Groq/OpenAI (set in `.env`)

### Setup

1. **Clone the repository**
2. **Backend Setup**:
   ```bash
   cd .. # To root if you are in frontend
   python -m venv venv
   source venv/bin/activate # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📄 License

MIT

---

## 👨‍💻 Created By

**P Niranjan**

- 🌐 [Portfolio](https://niranjan-portfolio-gold.vercel.app/)
- 🐙 [GitHub](https://github.com/pniranjan14)
- 💼 [LinkedIn](https://www.linkedin.com/in/pniranjannn/)
