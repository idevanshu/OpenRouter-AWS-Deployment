// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const modelSelect = document.getElementById('modelSelect');
const streamToggle = document.getElementById('streamToggle');
const usageInfo = document.getElementById('usageInfo');
const statusIndicator = document.getElementById('status');

let isProcessing = false;
let conversationHistory = [];

// Initialize
checkServerStatus();

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
clearBtn.addEventListener('click', clearChat);

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

// Check server status
async function checkServerStatus() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        if (data.status === 'ok') {
            updateStatus(true);
        }
    } catch (error) {
        updateStatus(false);
    }
}

function updateStatus(isOnline) {
    const html = isOnline
        ? '<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span><span class="text-sm text-green-400">Online</span>'
        : '<span class="w-2 h-2 bg-red-500 rounded-full"></span><span class="text-sm text-red-400">Offline</span>';
    statusIndicator.innerHTML = html;
}

// Clear welcome message
function clearWelcomeMessage() {
    const welcome = chatMessages.querySelector('.text-center');
    if (welcome) {
        welcome.remove();
    }
}

// Add message to chat
function addMessage(content, isUser = false, isStreaming = false) {
    clearWelcomeMessage();

    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`;
    
    const bubble = document.createElement('div');
    bubble.className = `max-w-[80%] rounded-2xl px-5 py-3 ${
        isUser 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none' 
            : 'bg-gray-700 text-gray-100 rounded-bl-none'
    }`;
    
    if (isStreaming) {
        bubble.innerHTML = `
            <div class="typing-indicator flex space-x-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
            </div>
        `;
    } else {
        bubble.innerHTML = `<div class="markdown-content">${formatMessage(content)}</div>`;
    }
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return bubble;
}

// Format message (basic markdown support)
function formatMessage(text) {
    // Escape HTML
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Code blocks
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isProcessing) return;
    
    isProcessing = true;
    sendBtn.disabled = true;
    messageInput.disabled = true;
    
    // Add user message
    addMessage(message, true);
    conversationHistory.push({ role: 'user', content: message });
    
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    const model = modelSelect.value;
    const useStreaming = streamToggle.checked;
    
    try {
        if (useStreaming) {
            await handleStreamingResponse(message, model);
        } else {
            await handleNormalResponse(message, model);
        }
    } catch (error) {
        addMessage(`Error: ${error.message}`, false);
    } finally {
        isProcessing = false;
        sendBtn.disabled = false;
        messageInput.disabled = false;
        messageInput.focus();
    }
}

// Handle normal response
async function handleNormalResponse(message, model) {
    const typingBubble = addMessage('', false, true);
    
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model })
    });
    
    if (!response.ok) {
        throw new Error('Failed to get response');
    }
    
    const data = await response.json();
    
    // Remove typing indicator and add actual response
    typingBubble.parentElement.remove();
    addMessage(data.response, false);
    
    conversationHistory.push({ role: 'assistant', content: data.response });
    
    // Update usage info
    if (data.usage) {
        usageInfo.textContent = `Tokens: ${data.usage.totalTokens} | Cost: $${data.usage.cost?.toFixed(6) || '0.000000'}`;
    }
}

// Handle streaming response
async function handleStreamingResponse(message, model) {
    const typingBubble = addMessage('', false, true);
    
    const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model })
    });
    
    if (!response.ok) {
        throw new Error('Failed to get response');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    // Remove typing indicator
    typingBubble.parentElement.remove();
    
    // Create message bubble for streaming
    const messageBubble = addMessage('', false);
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) {
                        fullResponse += parsed.content;
                        messageBubble.innerHTML = `<div class="markdown-content">${formatMessage(fullResponse)}</div>`;
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    }
    
    conversationHistory.push({ role: 'assistant', content: fullResponse });
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat?')) {
        chatMessages.innerHTML = `
            <div class="text-center py-12">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-comments text-3xl"></i>
                </div>
                <h2 class="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
                <p class="text-gray-400">Select a model and start chatting with AI</p>
            </div>
        `;
        conversationHistory = [];
        usageInfo.textContent = '';
    }
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);
