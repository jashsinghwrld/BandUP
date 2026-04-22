# BandUP: AI-Powered Writing Evaluation Platform

BandUP is a premium, multi-tenant B2B SaaS platform designed for IELTS coaching institutes. It automates writing task assignments, AI-powered evaluations using Claude 3.5 Sonnet, and provides deep analytics for trainers.

## 🚀 Key Features

- **7-Stage AI Evaluation**: Specialized pipeline for TA, CC, LR, and GRA scoring.
- **Dynamic Themes**: Professional Light and Dark mode support with Framer Motion animations.
- **Trainer Human-in-the-Loop**: Review, override, and approve AI evaluations.
- **AI Prompt Generation**: Generate realistic IELTS GT writing tasks instantly.
- **Student Performance Tracking**: Interactive writing interface with word counters and timers.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Auth.js (NextAuth) with Multi-tenancy support
- **AI**: Anthropic Claude 3.5 Sonnet
- **Styling**: Vanilla CSS with HSL Thematic variables
- **Animations**: Framer Motion

## 📦 Deployment on Vercel

### 1. Environment Variables
To deploy BandUP on Vercel, you must configure the following environment variables in the Vercel Dashboard:

```env
DATABASE_URL="your-postgresql-url"
ANTHROPIC_API_KEY="your-anthropic-key"
AUTH_SECRET="your-nextauth-secret"
AUTH_URL="your-deployment-url"
```

### 2. Database Migration
Ensure you run migrations to sync the schema with your production database:
```bash
npx drizzle-kit push
```

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## 📄 License
Internal / Private SaaS
