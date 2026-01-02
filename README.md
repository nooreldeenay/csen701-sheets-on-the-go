# 🟩 CSEN701: Sheet-On-The-Go

> **System Status**: ONLINE  
> **Kernel**: REACT V19  
> **Visuals**: RETRO_TERMINAL_V1  

---

## 📟 Overview

**Sheet-On-The-Go** is a retro-futuristic cheatsheet builder designed for CSEN701 students. Immerse yourself in a terminal-inspired environment where you can compile, merge, and export your study notes with hacker-like efficiency.

The interface combines modern web technologies with a nostalgic 90s cyberpunk aesthetic, complete with CRT scanlines, typewriter effects, and a command-line boot sequence.

## ✨ Features

- **🖥️ Retro Boot Sequence**: Experience a full BIOS-style startup with integrity checks, memory verification, and system initialization.
- **🎓 Interactive Tutorials**: Guided `TUTORIAL_GUIDE_V1.0` walks you through the system's capabilities step-by-step.
- **🧩 Dynamic Sheet Building**: 
  - Manage "Nodes" and "Code Blocks" via a file-system-like sidebar.
  - Toggle selections to customize your output.
  - "Merge Mode" allows combining multiple resources into a single view.
- **👁️ Live Preview**: Watch your sheet compile in real-time on the right-hand inspection panel.
- **📄 PDF Export**: Generate print-ready documents for your exams or archives with a single click.

## 🛠️ Tech Stack

- **Core**: React 19 + Vite (Fast HMR & Building)
- **Styling**: TailwindCSS 4 (Utility-first retro styling)
- **Math**: KaTeX (For beautiful mathematical formula rendering)
- **Icons**: Lucide React (Pixel-perfect scalable icons)

## 🚀 Initialization (Getting Started)

### 1. Clone the Matrix
```bash
git clone https://github.com/nooreldeenay/csen701-sheet-on-the-go.git
cd csen701-sheet-on-the-go
```

### 2. Install Subsystems
```bash
npm install
```

### 3. Boot System (Dev Server)
```bash
npm run dev
```
*Access the terminal at `http://localhost:5173`*

### 4. Build Distribution
```bash
npm run build
```

---
*Created by [Nooreldeenay](https://github.com/nooreldeenay)*
