<div align="center">
  <img src="https://chathive-app.vercel.app/logo.png" width="72" height="72" alt="ChatHive logo" />
  <h1>ChatHive</h1>
  <p><em>Real-time, anonymous & ephemeral chatrooms — no sign-ups, no history, just instant conversations.</em></p>

  <p>
    <a href="https://chathive-app.vercel.app/">
      <img src="https://img.shields.io/badge/Live%20Demo-Visit-0ea5e9?style=flat&logo=vercel" alt="Live Demo" />
    </a>
    <a href="https://github.com/sanjitxdutta/chathive">
      <img src="https://img.shields.io/badge/GitHub-Repository-111827?style=flat&logo=github" alt="GitHub Repo" />
    </a>
    <img src="https://img.shields.io/badge/License-MIT-10b981?style=flat" alt="MIT License" />
  </p>
</div>

---
<div align="center">
<h3>🛠️ Tech Stack</h3>

Frontend
<p>
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646cff?style=flat&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06b6d4?style=flat&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/React_Router-7-ca4245?style=flat&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Lucide_Icons-539?style=flat&logo=lucide&logoColor=white&color=black" alt="Lucide React" />
  <img src="https://img.shields.io/badge/ESLint-9-4b32c3?style=flat&logo=eslint&logoColor=white" alt="ESLint" />
</p>

Backend
<p>
  <img src="https://img.shields.io/badge/Node.js-18+-43853d?style=flat&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/WebSockets-ws-orange?style=flat&logo=websocket&logoColor=white" alt="ws" />
  <img src="https://img.shields.io/badge/ts--node-10.9-green?style=flat" alt="ts-node" />
</p>
</div>


[![ChatHive Preview](https://chathive-app.vercel.app/chathive_preview.png)](https://chathive-app.vercel.app/)


## ✨ Features

- ⚡ **Instant rooms** — generate a room ID and start chatting immediately  
- 👤 **Anonymous by default** — no accounts or personal data required  
- 💬 **Real-time messaging** — messages broadcast live to everyone in the room  
- 🧹 **Ephemeral** — chats are not persisted; leaving clears the session  
- 🌓 **Dark & Light themes** — easy on the eyes, automatic toggle  
- 📱 **Responsive UI** — tuned for mobile (handles mobile browser address bar with DVH/fallback)  
- 🖱️ **Nice UX touches** — copy-to-clipboard IDs, keyboard send, friendly status line  

---

## 🚀 Live Demo

<img width="1248" height="863" alt="Screenshot 2025-08-17 175849" src="https://github.com/user-attachments/assets/8b66d348-47f7-47e4-8be8-601ba4257dbc" />

---

## 🧠 How it works (high level)

ChatHive focuses on **in-the-moment** conversation.  
It does **not** store messages in a database; messages are **rendered and broadcast** to participants who are currently in the room.  
When you leave, your view of prior messages is gone.

> ⚠️ **Privacy note:** While there’s no persistence layer, traffic still travels over the network. Do not share sensitive information. End-to-end encryption is **not** implemented unless explicitly stated.

---

## 📦 Project Structure (simplified)

```
chathive/
├─ backend/                                     # WebSocket server
│  ├─ src/
│  │  ├─ utils/                                 # Helper utilities
│  │  └─ index.ts                               # Server entrypoint
│  ├─ .gitignore
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ tsconfig.json
│  └─ tsconfig.tsbuildinfo
│
├─ frontend/                                    # React + Vite client
│  ├─ public/                                   # Static assets 
│  ├─ src/
│  │  ├─ components/                            # Reusable UI components
│  │  ├─ context/                               # React Context providers
│  │  ├─ hooks/                                 # Custom React hooks
│  │  ├─ pages/                                 # Page-level routes
│  │  ├─ types/                                 # Shared TypeScript types
│  │  ├─ App.tsx                                # Root component
│  │  ├─ index.css                              # Global styles
│  │  ├─ main.tsx                               # ReactDOM entry
│  │  └─ vite-env.d.ts                          # Vite TS types
│  ├─ .gitignore
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ tsconfig.app.json
│  ├─ tsconfig.node.json
│  ├─ tsconfig.json
│  ├─ vercel.json                               # Deployment config
│  └─ vite.config.ts
│
├─ LICENSE
└─ README.md

```

## 🧑‍💻 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/sanjitxdutta/chathive.git
cd chathive
```
### ⚙️ Backend Setup (WebSocket Server)
### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
By default, the backend runs on:

👉 ws://localhost:8080

### 4. Build for Production
```bash
npm run build
npm run start
```

### 💻 Frontend Setup (React + Vite Client)
### 5. Install Dependencies
```bash
cd frontend
npm install
```

### 6. Environment Variables
Create a .env file inside the frontend/ directory:
```bash
VITE_WS_URL=ws://localhost:8080
```
Replace with your deployed backend URL when in production.

### 7. Run Development Server
```bash
npm run dev
```
Visit the printed local URL (e.g., http://localhost:5173).

### 8. Build for Production
```bash
npm run build
```

### 9. Preview Production Build
```bash
npm run preview
```

---

## 🧭 Usage

1. **Create a room:** click **Generate Room** on the homepage  
2. **Share the ID:** send the code/link to friends  
3. **Start chatting:** messages appear in real‑time for everyone in the room  
4. **Leave anytime:** the chat view clears when you exit

## 🔒 Privacy & Security

- No account creation  
- No message history after you leave the room  
- No database persistence for chat content  
- **Do not** use for sensitive or confidential data

## 🗺️ Roadmap Ideas

- Room passwords / invite links  
- Nicknames & avatars  
- Message reactions & link previews  
- PWA installable app  
- AI‑powered chat summaries  
- Presence indicators (typing/online)

## 🤝 Contributing

Issues and PRs are welcome! If you spot a bug or have an idea, please open an issue first to discuss the approach.

## 📜 License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

**ChatHive** — a buzzing hive of conversations that exist only while you’re there. 🐝
