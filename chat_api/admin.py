from django.contrib import admin
from .models import Document, ChatSession, Message

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'status', 'upload_date')
    list_filter = ('status',)

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_at')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'role', 'content_snippet', 'created_at')
    
    def content_snippet(self, obj):
        return obj.content[:50]
    content_snippet.short_description = 'Content Snapshot'
