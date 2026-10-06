# Deploying AT TRADING on Netlify

This application is fully pre-configured for automated and manual Netlify deployment.

## Option 1: Git-Based Deployment (Recommended)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Log in to [Netlify](https://app.netlify.com).
3. Click **"Add new site"** → **"Import an existing project"**.
4. Select your Git repository.
5. Netlify will automatically detect the settings from `netlify.toml`:
   - **Base directory**: `/` (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**.

---

## Option 2: Netlify Drop (Instant Drag & Drop)

1. Run the production build command locally:
   ```bash
   npm run build
   ```
2. Navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder into the browser window.
4. Your website is live instantly with an SSL certificate.

---

## Pre-configured Netlify Settings in this Repository

* **`netlify.toml`**:
  * Configures the build command (`npm run build`) and publish directory (`dist`).
  * Sets up Single-Page Application (SPA) redirect rules to prevent 404 errors on deep linking or browser refresh.
  * Adds security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
  * Adds 1-year immutable caching for static assets in `/assets/*`.
* **`public/_redirects`**:
  * Fallback redirect file copied to `dist/` upon build: `/* /index.html 200`.
