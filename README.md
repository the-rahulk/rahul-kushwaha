# Rahul Kushwaha — Portfolio

> **Live:** [rahulkushwaha.me](https://www.rahukushwaha.me) *(deploy link goes here)*

A conversational, chat-style developer portfolio built with Vite + Tailwind CSS v4. Instead of a traditional resume layout, the site simulates an interview — questions appear one at a time as you scroll, and answers reveal with smooth animations.

---

## ✨ Features

- **Chat-driven UX** — Portfolio presented as a live interview conversation
- **Scroll-gated sections** — Each question appears only after scrolling past the previous answer, keeping the experience intentional
- **Animated skill grid** — Tech stack pills cascade in with staggered reveal animations across 9 skill categories
- **Commit-log style experience cards** — Deloitte work showcased as Git commit entries with impact metrics
- **Certification cards** — AWS & Claude certifications with flip-card interactions
- **Dark-mode first** — Deep dark theme with electric indigo and ember accent palette
- **Fully responsive** — Mobile-first layout, optimised for all screen sizes
- **Keyboard & accessibility friendly** — Semantic HTML, ARIA roles, and focus-visible states throughout

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Bundler | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Language | Vanilla JavaScript (ES Modules) |
| 3D / Canvas | [Three.js](https://threejs.org/) *(particle background)* |
| Fonts | Inter, JetBrains Mono (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & run locally

```bash
# Clone the repo
git clone https://github.com/the-rahulk/rahul-kushwaha.git
cd rahul-kushwaha

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev
```

### Build for production

```bash
npm run build
# Output goes to /dist
```

---

## 📁 Project Structure

```
rahul-kushwaha/
├── index.html          # Main HTML — all content lives here
├── src/
│   ├── main.js         # Entry point, Three.js particle setup
│   ├── chatEngine.js   # Scroll-driven section reveal & animation logic
│   └── style.css       # Tailwind v4 config + custom design tokens
├── public/
│   └── assets/         # Avatar images, certification badges, OG image
├── vite.config.js
└── package.json
```

---

## 🎨 Design Tokens

Colours are defined as CSS custom properties in `src/style.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-void-black` | `#0a0a0f` | Page background |
| `--color-electric-indigo` | `#6366f1` | Primary accent |
| `--color-ember` | `#f97316` | Highlight / metric numbers |
| `--color-pale-wire` | `#e2e8f0` | Body text |
| `--color-muted-fog` | `#64748b` | Secondary text |

---

## 📬 Contact

- **Email:** rahulkushwaha1922@gmail.com
- **LinkedIn:** [linkedin.com/in/rahulkushwaha1922](https://www.linkedin.com/in/rahulkushwaha1922/)
- **GitHub:** [github.com/the-rahulk](https://github.com/the-rahulk)


