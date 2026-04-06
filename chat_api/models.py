from django.db import models
from django.utils import timezone

class Document(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('ingested', 'Ingested'),
        ('failed', 'Failed'),
    )
    
    file = models.FileField(upload_to='documents/')
    file_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    def __str__(self):
        return f"{self.file_name} ({self.status})"

class ChatSession(models.Model):
    document = models.ForeignKey(Document, related_name='sessions', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.title or f"Session {self.id}"

class Message(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('ai', 'AI'),
    )
    
    session = models.ForeignKey(ChatSession, related_name='messages', on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    sources = models.JSONField(blank=True, null=True, help_text="List of exact page numbers and chunk previews")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"[{self.role}] {self.content[:50]}"
