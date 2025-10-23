# ⚙️ Configuration Guide - What You Need to Update

This document lists **everything** you need to customize with your real data before deploying StraightEdit.

---

## 🔴 REQUIRED: Must Update Before Running

### 1. Environment Variables (.env file)

**Status:** ❌ **REQUIRED - CREATE THIS FILE**

**Action:** Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here
```

**Where to get these values:**
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Project Settings → API
4. Copy the Project URL and anon/public key

**Important:** Without this file, the app will not work!

---

### 2. Supabase Database Setup

**Status:** ❌ **REQUIRED - RUN MIGRATION**

**Action:** Execute the SQL migration in Supabase:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy the contents of: `supabase/migrations/20251023135854_create_content_editor_schema.sql`
4. Paste and run in SQL Editor

This creates the necessary database tables.

---

## 🟡 RECOMMENDED: Update for Production

### 3. package.json

**Status:** ⚠️ **Contains placeholder data**

**Current placeholders:**
```json
"author": "Your Name <your-email@example.com>",
"repository": {
  "url": "https://github.com/yourusername/straightedit"
}
```

**Update to:**
```json
"author": "Your Actual Name <real-email@example.com>",
"repository": {
  "url": "https://github.com/your-real-github-username/straightedit"
}
```

---

### 4. README.md

**Status:** ⚠️ **Contains placeholder URLs**

**Lines to update:**

**Line 123** - Clone command:
```bash
# Current
git clone https://github.com/yourusername/straightedit.git

# Change to
git clone https://github.com/your-real-username/straightedit.git
```

**Line 295-296** - Example env vars (just examples, but update if you want):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Bottom section (~line 400+)** - Contact & Links:
```markdown
## 📞 Contact & Links

- **GitHub**: https://github.com/your-real-username/straightedit
- **Website**: https://your-domain.com (if you have one)
- **Email**: your-email@example.com
- **Issues**: https://github.com/your-real-username/straightedit/issues
```

---

## 🟢 NO ACTION NEEDED: UI Placeholders

These are **placeholder text in the user interface** - they guide users but don't need updating:

### LoginForm.tsx
```tsx
placeholder="you@example.com"        // ✅ This is fine - it's a UI hint
placeholder="••••••••"               // ✅ This is fine - shows password field
```

### CreateProject.tsx
```tsx
placeholder="https://github.com/username/repository"  // ✅ UI example
placeholder="My Website"                               // ✅ UI example
placeholder="main"                                     // ✅ UI example
placeholder="ghp_..."                                  // ✅ UI example
```

### ContentEditor.tsx
```tsx
placeholder="Search content..."      // ✅ UI placeholder
```

### DeployModal.tsx
```tsx
placeholder="Describe your changes..." // ✅ UI placeholder
```

**These are NOT your data** - they're examples shown to users in input fields!

---

## 📋 Quick Checklist

Before deploying, make sure you've done these:

- [ ] Created `.env` file with real Supabase credentials
- [ ] Ran database migration in Supabase
- [ ] Updated `package.json` with your name and GitHub URL
- [ ] Updated README.md with your GitHub username
- [ ] Updated README.md contact section
- [ ] Tested locally with `npm run dev`
- [ ] Built successfully with `npm run build`

---

## 🎯 Priority Order

**If you're in a hurry, do this minimum:**

1. ✅ Create `.env` file (app won't work without it)
2. ✅ Run Supabase migration (app won't work without it)
3. ✅ Update package.json author/repository
4. ⏭️ README updates can wait

---

## 🔍 How to Find & Replace

If you want to update everything at once:

### Search for these patterns:
- `yourusername` → Your GitHub username
- `your-email@example.com` → Your real email
- `Your Name` → Your real name
- `your-project` → Your Supabase project ID
- `your-domain.com` → Your actual domain (if any)

### Files to check:
1. ✅ `package.json` (lines 7, 9-10)
2. ✅ `README.md` (lines 123, 295-296, bottom section)
3. ✅ `.env` (create this file)

---

## 💡 Pro Tips

### For Local Development
You can start immediately after creating `.env` and running migration. Other updates are cosmetic.

### For Public Release
Update everything in package.json and README.md so people know who made it!

### For Client Delivery
Only `.env` and database matter. Clients won't see package.json or README.

### For GitHub Repository
Update all GitHub URLs to match your actual repository name.

---

## ❓ Common Questions

**Q: Do I need to update the UI placeholders?**
No! Those are just examples shown to users in empty input fields.

**Q: What happens if I don't update package.json?**
The app works fine, but credits/links will point to placeholders.

**Q: Can I skip the README updates?**
Yes for functionality, but no for professionalism if sharing publicly.

**Q: Is .env required?**
Absolutely! The app cannot connect to database without it.

---

## 🚀 Ready to Start?

1. Create `.env` file with your Supabase credentials
2. Run the database migration
3. Run `npm install`
4. Run `npm run dev`
5. Visit `http://localhost:5173`

Everything should work! Update the other items when you're ready to deploy or share.

---

**Good luck! 🎉**

