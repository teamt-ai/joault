# Joault — Premium Real-Time Group Spaces

Joault is a professional, group-only social platform built with **Next.js (App Router)**, **Tailwind CSS**, and **Supabase**. It provides structured, private workspaces called "Spaces" where group members interact in a highly organized, grid-based card layout.

---

## 🌟 Key Features

*   **🔒 Auth Protocol Security:** Every Space has a unique, secure alphanumeric key (e.g. `SPACE-A1B2-C3D4-E5F6`). To request entrance to a space, users must input this code.
*   **🤝 Owner Approval Workflow:** Entering the code initiates an access request. The creator/owner of the space must approve the request before the member can view or send messages.
*   **📦 Structured Chat Cards:** Instead of a single chaotic timeline, each group member has their own dedicated visual card/box displaying their messages, making it easy to track individual updates.
*   **⚡ Real-Time Syncing:** Messages, user joining status, and admin approvals sync instantly using WebSockets.
*   **☕ Premium Coffee & Espresso Aesthetics:** Styled in deep browns, chocolates, creams, and warm sand gold accents with a custom scrollbar and ambient glowing backdrops.

---

## 🚀 Getting Started

### 1. Installation

Scaffold dependencies are already set up. Simply run:
```bash
npm install
```

### 2. Configuration & Supabase Setup

#### Option A: Demo Mode (No Setup Required)
If you run the app without environment variables, it will automatically fallback to **Demo Mode**. It will load simulated profiles, mock spaces, and save all messages/spaces in your browser's `localStorage`. You can open multiple tabs, create accounts, join spaces, approve requests, and chat in real-time.

#### Option B: Real Supabase Setup
To connect to a live Supabase project:
1.  Go to the [Supabase Dashboard](https://supabase.com/dashboard) and create a project.
2.  Open the **SQL Editor** in your Supabase dashboard and run the DDL schema provided in `supabase/schema.sql`. This sets up the tables, Row Level Security (RLS) policies, and profile automation triggers.
3.  Create a `.env.local` file in the root of this project and configure your keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
    ```

### 3. Run Locally

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience Joault.

---

## 💻 Technical Stack

*   **Frontend:** Next.js 15 (React 19, TypeScript)
*   **Styling:** Tailwind CSS (v4)
*   **Icons:** Lucide React
*   **Effects:** Canvas Confetti
*   **Backend Database / Auth / Real-time:** Supabase
*   **Deployment:** Vercel

---

## 🚀 Deploying to Vercel

1.  Initialize a local git repository:
    ```bash
    git init
    git add .
    git commit -m "Initial commit - Joault App"
    ```
2.  Create a new repository on [GitHub](https://github.com) and push your local commits.
3.  Import the repository into your [Vercel Dashboard](https://vercel.com).
4.  Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in your Vercel project settings, and click **Deploy**!
