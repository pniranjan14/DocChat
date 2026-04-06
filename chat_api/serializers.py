from rest_framework import serializers
from .models import Document, ChatSession, Message

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'file', 'file_name', 'upload_date', 'status']
        read_only_fields = ['file_name', 'status']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'sources', 'created_at']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'created_at', 'messages', 'document']
