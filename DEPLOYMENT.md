
# Deployment Guide: Aura Health Intelligence

Since Aura is a static frontend application leveraging modern ESM (ES Modules), it requires no complex server-side environment other than a place to serve static files and a way to provide the `API_KEY`.

## 🔑 Obtaining your API Key
Aura requires a Google Gemini API Key to power its Neural Core.
1.  **Generate Key:** Visit [Google AI Studio (aistudio.google.com)](https://aistudio.google.com/app/apikey).
2.  **Project Selection:** Create a new API key in a Google Cloud Project.
3.  **Billing (Recommended):** While there is a free tier, certain advanced features (like high-frequency nutrition parsing) perform best on a paid project. See [Gemini API Billing Docs](https://ai.google.dev/gemini-api/docs/billing) for more information.

## 1. Vercel (Recommended)
1.  Push your code to a **GitHub**, **GitLab**, or **Bitbucket** repository.
2.  Import the project into [Vercel](https://vercel.com/new).
3.  **Crucial Step:** Under "Environment Variables", add:
    *   **Key:** `API_KEY`
    *   **Value:** `[Your Gemini API Key]`
4.  Vercel will detect the project as a static site. Click **Deploy**.

## 2. Netlify
1.  Log in to [Netlify](https://app.netlify.com/).
2.  Choose "Import from Git" and select your repository.
3.  Go to **Site configuration > Environment variables**.
4.  Add `API_KEY` with your Gemini key.
5.  Trigger a new deploy.

## 3. Cloudflare Pages
1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages > Create application > Pages > Connect to Git**.
3.  Select your repository.
4.  In the "Set up builds and deployments" section, add `API_KEY` to the **Environment variables** section.
5.  Save and Deploy.

## ⚠️ Security Note
Aura is a prototype dashboard that accesses the Gemini API directly from the client. For a production-grade application, you should:
1.  Set up an API Proxy (Vercel Functions or Netlify Functions) to hide your `API_KEY`.
2.  Add CORS restrictions to your API Key in the [Google Cloud Console](https://console.cloud.google.com/).
3.  Implement User Authentication (provided in `Auth.tsx`, but currently simulated).

## 🌍 Sharing the Link
Once deployed, you can share the generated URL (e.g., `aura-health.vercel.app`). Because Aura uses `localStorage`, your personal health logs will **not** be visible to others who open the link—they will see their own private instance of the dashboard.
