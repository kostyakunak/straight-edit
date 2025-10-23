# 🚀 START HERE - Quick Setup

## Before You Run the App

### Step 1: Create .env File

Create a file named `.env` in the root directory with:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_key_here
```

**Get these from:** https://app.supabase.com → Your Project → Settings → API

---

### Step 2: Setup Database

1. Go to your Supabase project
2. Open SQL Editor
3. Run the file: `supabase/migrations/20251023135854_create_content_editor_schema.sql`

---

### Step 3: Install & Run

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

---

## What to Update (Your Real Data)

### Required ❌
- `.env` file (must create it)
- Supabase database migration (must run it)

### Recommended ⚠️
- `package.json` → Lines 7, 9-10 (your name, email, GitHub URL)
- `README.md` → Line 123 (GitHub URL)
- `README.md` → Bottom section (contact info)

### Not Needed ✅
- UI placeholders like `placeholder="you@example.com"` are fine as-is
- They're just hints for users in input fields

---

## Full Details

- **Complete setup guide:** See `CONFIGURE.md`
- **Documentation:** See `README.md`
- **Setup instructions:** See `SETUP.md`

---

**Questions? Check CONFIGURE.md for detailed explanations!**

---

**Author:** Konstantin Kunak (kostyakunak@gmail.com)  
**GitHub:** https://github.com/kostyakunak/straight-edit

