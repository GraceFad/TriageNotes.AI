<div align="center">

<img width="1200" height="475" alt="TriageNotes.AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

<h1>TriageNotes.AI</h1>

<p><strong>AI-powered medical transcription and EHR data extraction for nurses.</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini-Flash-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" />
</p>

<p>
  <a href="https://ai.studio/apps/ad55282e-9145-42c2-9d51-b72195278dbd">View in AI Studio</a> ·
  <a href="## Getting Started>Getting Started</a> ·
  <a href="#-features">Features</a>
</p>

</div>

---

## About

TriageNotes.AI is an AI-powered clinical note-taking tool built to help nurses triage patients faster and more accurately. Record a patient encounter, and the app instantly transcribes the audio, extracts structured EHR data, and assigns a triage priority level — all in seconds.

Developed as part of **BUSI 7220 – Information Technology for Competitive Advantage**, this project demonstrates how large language models and voice AI can be applied to real-world healthcare challenges to reduce documentation burden and improve clinical efficiency.

---

## Features

### 🎙️ Live audio recording
One-tap recording with a real-time frequency visualizer. Captures the nurse-patient encounter via the browser microphone using the Web Audio API.

### 🧠 AI transcription + structured extraction
Sends the audio to **Gemini Flash** which simultaneously transcribes the encounter and extracts structured EHR fields — no two-step pipeline required.

### 📋 Auto-generated EHR data
From a single recording, the app populates:

| Field | Description |
|---|---|
| Chief Complaint | Primary reason for visit |
| History of Present Illness | Narrative summary of the encounter |
| Vitals | Temp, BP, HR, RR, SpO₂ |
| Allergies | Extracted from spoken mention |
| Medications | Current medications mentioned |
| Past Medical History | Relevant background conditions |
| Triage Priority | ESI Level 1–5 classification |
| Recommended Action | Next steps for the care team |

### 🚦 5-level triage classification
Automatically assigns an Emergency Severity Index (ESI) priority level, color-coded from critical (Level 1) to non-urgent (Level 5).

### 📝 Verbatim transcript toggle
Full audio log available on demand — reviewable alongside the structured EHR output.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| AI / LLM | Google Gemini Flash (`gemini-3-flash-preview`) |
| Speech | Web Audio API + MediaRecorder |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer Motion) |
| Build tool | Vite 6 |
| Icons | Lucide React |

---

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/triagenotes-ai.git
   cd triagenotes-ai
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your Gemini API key:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

   Get a free API key at [aistudio.google.com](https://aistudio.google.com).

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000`.

---

## How It Works

```
Nurse speaks → MediaRecorder captures audio (WebM)
     ↓
Audio blob sent to Gemini Flash (inline base64)
     ↓
Gemini returns structured JSON via response schema
     ↓
App renders EHR card, vitals grid, triage badge, and transcript
```

The entire transcription + extraction pipeline is a **single Gemini API call** using a strict JSON response schema — ensuring consistent, parseable output every time.

---

## Project Context

> **Course:** BUSI 7220 – Information Technology for Competitive Advantage  
> **Objective:** Develop AI-driven solutions to real-world business and operational problems.  
> **Problem addressed:** Nurses spend significant time on manual documentation during triage. This tool explores how voice AI + LLMs can reduce that burden and support faster clinical decision-making.

---

## Roadmap

- [x] Audio recording with live visualizer
- [x] Gemini transcription + EHR extraction
- [x] Triage priority classification (ESI Level 1–5)
- [x] Vitals display grid
- [x] Verbatim transcript toggle
- [ ] PDF export of EHR note
- [ ] EHR system integration (FHIR/HL7)
- [ ] Multi-patient session history

---

## License

MIT © 2026 — Built for BUSI 7220 class project.
