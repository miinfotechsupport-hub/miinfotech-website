# 🚀 Deployment Guide: MIInfotech Hassan Doorstep IT

This project is built with a **React + Vite Frontend** and an **Express.js Backend** (serving API endpoints like the server-side Gemini AI Chatbot, local bookings log, and Google Reviews live cache sync).

Because **Netlify** is primarily designed for **Static Sites & Serverless Functions**, you have a couple of excellent ways to deploy this website. Below are step-by-step instructions for each option.

---

## 💡 Option A: Deploy Frontend to Netlify + Backend to a Free Node Host (Recommended)
This option keeps 100% of the features working, including the server-side Gemini AI Chatbot and Google Reviews live synchronizer, by splitting the frontend and backend.

### 1. Deploy the Backend to Render or Railway
You can host the Express backend on platforms like **Render.com** or **Railway.app** for free/cheap.
- Sign up on [Render.com](https://render.com) or [Railway.app](https://railway.app).
- Connect your GitHub repository containing this project.
- Configure the following settings on Render/Railway:
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm run start`
  - **Environment Variables**:
    - `NODE_ENV=production`
    - `GEMINI_API_KEY=your_gemini_api_key_here`
    - `GOOGLE_MAPS_PLATFORM_KEY=your_google_maps_key_here`
    - `GOOGLE_PLACE_ID=your_google_place_id_here`

### 2. Deploy the Frontend to Netlify
- We have created a `netlify.toml` in your project root which tells Netlify exactly how to build and route your React application.
- Sign up on [Netlify](https://www.netlify.com).
- Click **Add new site** -> **Import an existing project** and select your GitHub repository.
- Netlify will automatically detect the settings from `netlify.toml`:
  - **Build Command**: `npm run build`
  - **Publish directory**: `dist`
- If you split your backend to Render/Railway, add an environment variable in Netlify:
  - `VITE_API_URL=https://your-backend-render-app.onrender.com` (update your client-side fetch calls to point to this URL instead of relative `/api/*`).

---

## ⚡ Option B: Pure Static Frontend on Netlify (Easiest & Free)
If you do not want to manage a running backend server and prefer a **100% free, zero-maintenance static website**, you can deploy the frontend directly to Netlify.

### ⚠️ What happens to the server-side features?
- **WhatsApp Dispatch (Callback Form)**: **100% fully functional!** The callback form is designed with an immediate "Verify and Send on WhatsApp" dispatch flow that is fully client-side.
- **Reviews & FAQs**: The app displays beautiful, high-conversion verified local reviews out of the box with zero external requests needed.
- **AI IT Consultant Chatbot**: The chatbot's relative `/api/chat` route will not resolve without a running backend. (The client will gracefully show a notice suggesting customers call or WhatsApp Mohammed Ishtiaqh directly, keeping conversion rates high).

### How to Deploy on Netlify:
1. Connect your GitHub repository to [Netlify](https://www.netlify.com).
2. Use the default settings from the `netlify.toml` we provided:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Click **Deploy Site**! Your high-performance, responsive doorstep IT website is live in seconds with global CDN acceleration and free SSL.

---

## 🐳 Option C: Single-Container Deployment (Docker / Cloud Run)
Since the app is fully containerized, you can also deploy it in one piece on **Google Cloud Run**, **Render Web Services**, or **Railway**.
- No code split is needed.
- The build process compiles the server and client into a unified, high-performance CJS server.
