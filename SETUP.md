# 🚀 StraightEdit Setup Guide

This guide will help you configure StraightEdit with your real data.

---

## ✅ Checklist: What You Need to Update

### 1. **Environment Variables** (Required)

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get these:**
1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon/public key` → `VITE_SUPABASE_ANON_KEY`

---

### 2. **Package.json** (Optional)

Update the project metadata in `package.json`:

```json
{
  "name": "straightedit",
  "version": "1.0.0",
  "description": "Visual content editor for GitHub-hosted static websites",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/straightedit"
  },
  "homepage": "https://your-domain.com"
}
```

---

### 3. **README.md** (Recommended)

Update the following sections in `README.md`:

**Line 123** - Repository URL:
```bash
git clone https://github.com/yourusername/straightedit.git
```
Change `yourusername` to your actual GitHub username.

**Bottom section** - Contact & Links:
```markdown
## 📞 Contact & Links

- **Website**: https://your-domain.com
- **GitHub**: https://github.com/yourusername/straightedit
- **Email**: your-email@example.com
- **Issues**: https://github.com/yourusername/straightedit/issues
```

---

### 4. **Supabase Database** (Required)

Run the database migration to create necessary tables:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open and execute this file:
   ```
   supabase/migrations/20251023135854_create_content_editor_schema.sql
   ```

**Tables created:**
- `projects` - Stores GitHub repository information
- `content_items` - Stores extracted content and changes

---

### 5. **GitHub Token Permissions** (Required for users)

When users create projects, they need a GitHub Personal Access Token with these permissions:

**For public repositories:**
- ✅ `public_repo` - Access to public repositories

**For private repositories:**
- ✅ `repo` - Full control of private repositories

**How to create:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes listed above
4. Generate and save the token

---

## 📝 Current Test/Placeholder Data

### No Action Required (These are UI placeholders)

The following are **UI placeholders** for user input - they don't need to be changed:

**In login form:**
- `you@example.com` - Email input placeholder
- `••••••••` - Password input placeholder

**In create project form:**
- `https://github.com/username/repository` - Repository URL placeholder
- `My Website` - Project name placeholder
- `main` - Branch name placeholder
- `ghp_...` - GitHub token placeholder

**In editor:**
- `Search content...` - Search box placeholder
- `Describe your changes...` - Commit message placeholder

These are just hints for users and don't need to be updated!

---

## 🎯 Quick Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/straightedit.git
   cd straightedit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   # Then edit .env with your Supabase credentials
   ```

4. **Setup Supabase database**
   - Run the migration SQL in Supabase dashboard

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔒 Security Notes

### ⚠️ Important Files (DO NOT COMMIT)

Add these to `.gitignore` (already included):
- `.env` - Contains your Supabase credentials
- `.env.local`
- `.env.*.local`

### ✅ Safe to Commit

- `.env.example` - Template without real credentials
- All source code
- Configuration files

---

## 🚀 Deployment Options

### Option 1: Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Option 2: Vercel
1. Import your GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard

### Option 3: GitHub Pages
1. Build: `npm run build`
2. Deploy `dist` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

**Note:** Remember to add environment variables in your deployment platform!

---

## ❓ FAQ

**Q: I get "Invalid Supabase credentials" error**
- Check your `.env` file exists
- Verify the credentials are correct
- Make sure variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Q: Can't connect to GitHub**
- Verify the GitHub Personal Access Token is valid
- Check token has required permissions
- Ensure repository URL is correct

**Q: Database tables don't exist**
- Run the migration SQL in Supabase SQL Editor
- Check tables were created in Supabase Table Editor

**Q: Changes not deploying**
- Verify GitHub token has write permissions
- Check repository and branch names are correct
- Look for error messages in browser console

---

## 📞 Need Help?

- **Documentation**: See README.md
- **Issues**: Report bugs on GitHub
- **Supabase Docs**: https://supabase.com/docs

---

**You're all set! Happy editing! 🎉**

