import os
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Document, ChatSession, Message
from .serializers import DocumentSerializer, ChatSessionSerializer, MessageSerializer
from .utils import ingest_document, get_answer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def perform_create(self, serializer):
        # Save the file name automatically
        file_obj = self.request.data.get('file')
        doc = serializer.save(file_name=file_obj.name, status='pending')
        
        # 1. Create a dedicated ChatSession for this document
        ChatSession.objects.create(title=doc.file_name, document=doc)
        
        # 2. Trigger ingestion (Phase 2 integration) with doc_id
        try:
            ingest_document(doc.file.path, doc.id)
            doc.status = 'ingested'
            doc.save()
        except Exception as e:
            doc.status = 'failed'
            doc.save()
            print(f"Ingestion Error: {e}")

class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all().order_by('-created_at')
    serializer_class = ChatSessionSerializer

    @action(detail=True, methods=['post'])
    def chat(self, request, pk=None):
        session = self.get_object()
        user_query = request.data.get('message') or request.data.get('query')
        # Priority: 1. Request Body doc_id, 2. Session-linked document ID
        doc_id = request.data.get('doc_id') or (session.document.id if session.document else None)
        
        if not user_query:
            return Response({"error": "Message or Query is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # 1. Save User Message
        Message.objects.create(session=session, role='user', content=user_query)
        
        # 2. Get AI Answer + Sources with document-specific context
        answer, sources = get_answer(user_query, doc_id=doc_id)
        
        # 3. Save AI Message
        ai_message = Message.objects.create(
            session=session, 
            role='ai', 
            content=answer, 
            sources=sources
        )
        
        return Response(MessageSerializer(ai_message).data)

# Overriding as_data for a cleaner return format in the action
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
