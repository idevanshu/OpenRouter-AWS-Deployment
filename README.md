<body>

<h1>🚀 AI Chat Application with OpenRouter & AWS EC2</h1>

<p>
A powerful AI Chat Application built with <strong>Node.js v20</strong>, 
<strong>Express.js</strong>, and <strong>OpenRouter API</strong>.
Supports multiple AI models with real-time streaming responses and deployed on AWS EC2 using PM2.
</p>

<p>
<strong>Badges:</strong> Node.js v20 | Express.js | OpenRouter API | MIT License
</p>

<hr>

<h2>✨ Features</h2>
<ul>
<li>🤖 Multiple AI Models (GPT-4o, Claude 3.5 Sonnet, DeepSeek R1, Gemini 1.5 Pro, Llama 3.1)</li>
<li>⚡ Real-time Streaming Responses</li>
<li>🎨 Beautiful Tailwind CSS UI</li>
<li>📊 Usage Tracking</li>
<li>🔐 Secure Environment Configuration</li>
<li>🚀 AWS EC2 Production Deployment</li>
</ul>

<hr>

<h2>📦 Prerequisites</h2>
<ul>
<li>Node.js v20+</li>
<li>npm or yarn</li>
<li>AWS Account</li>
<li>OpenRouter API Key</li>
<li>Git</li>
</ul>

<hr>

<h2>🛠 Local Setup Guide</h2>

<h3>1️⃣ Clone Repository</h3>
<pre><code>
git clone https://github.com/idevanshu/OpenRouter-AWS-Deployment.git
</code></pre>

<h3>2️⃣ Install Dependencies</h3>
<pre><code>
npm install
</code></pre>

<h3>3️⃣ Configure Environment</h3>
<pre><code>
touch .env
</code></pre>

<pre><code>
PORT=3000
OPENROUTER_API_KEY=your_api_key_here
</code></pre>

<h3>4️⃣ Run Development Server</h3>
<pre><code>
npm run dev
</code></pre>

<p>Open: http://localhost:3000</p>

<hr>

<h2>📁 Project Structure</h2>
<pre><code>
ai-chat-app/
├── public/
├── routes/
├── controllers/
├── services/
├── app.js
├── package.json
└── .env
</code></pre>

<hr>

<h2>📡 API Endpoints</h2>

<h3>POST /api/chat</h3>

<pre><code>
{
  "model": "gpt-4o",
  "message": "Explain quantum computing"
}
</code></pre>

<h3>Response (Streaming)</h3>
<pre><code>
{
  "response": "Quantum computing is..."
}
</code></pre>

<hr>

<h2>☁️ AWS EC2 Deployment Guide</h2>

<h3>1️⃣ Launch EC2 Instance</h3>
<ul>
<li>Ubuntu 22.04</li>
<li>t2.medium (recommended)</li>
<li>Open Ports: 22, 80, 443</li>
</ul>

<h3>2️⃣ SSH Into Server</h3>
<pre><code>
ssh -i your-key.pem ubuntu@your-ec2-ip
</code></pre>

<h3>3️⃣ Install Node.js v20</h3>
<pre><code>
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
</code></pre>

<h3>4️⃣ Clone Project & Install</h3>
<pre><code>
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app
npm install
</code></pre>

<h3>5️⃣ Setup PM2</h3>
<pre><code>
sudo npm install -g pm2
pm2 start app.js --name ai-chat-app
pm2 save
pm2 startup
</code></pre>

<hr>

<h2>⚙️ PM2 Commands</h2>
<pre><code>
pm2 list
pm2 restart ai-chat-app
pm2 logs ai-chat-app
pm2 stop ai-chat-app
</code></pre>

<hr>

<h2>🔒 Production Best Practices</h2>
<ul>
<li>Use Nginx Reverse Proxy</li>
<li>Enable SSL via Let's Encrypt</li>
<li>Configure UFW Firewall</li>
<li>Use PM2 Monitoring</li>
<li>Enable Auto Restart on Crash</li>
</ul>

</body>
