# 📝 Complete Placeholders Reference

This document lists **ALL** placeholder/test text in the project and whether you need to update them.

---

## ❌ MUST UPDATE - These are YOUR data

### 1. Environment Variables (Not in repo - YOU CREATE THIS)

**File:** `.env` (create this file)

```env
VITE_SUPABASE_URL=your_supabase_url_here    # ❌ REPLACE with real Supabase URL
VITE_SUPABASE_ANON_KEY=your_supabase_key_here  # ❌ REPLACE with real key
```

---

### 2. Package.json

**File:** `package.json`

```json
Line 7:  "author": "Your Name <your-email@example.com>",
         # ❌ REPLACE: Your Name → Your Real Name
         # ❌ REPLACE: your-email@example.com → Your Real Email

Line 9-10: "repository": {
             "url": "https://github.com/yourusername/straightedit"
           }
         # ❌ REPLACE: yourusername → Your GitHub Username
```

---

### 3. README.md

**File:** `README.md`

```markdown
Line 123: git clone https://github.com/yourusername/straightedit.git
          # ❌ REPLACE: yourusername → Your GitHub Username

Line 295-296 (in .env example):
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
# ⚠️ OPTIONAL: These are just examples in docs, but you can update

Bottom section (~line 400):
## 📞 Contact & Links
- **GitHub**: [Your Repository URL]
- **Issues**: [Report bugs or request features]
- **Discussions**: [Ask questions and share ideas]
# ❌ REPLACE: Add your actual GitHub URLs and contact info
```

---

## ✅ DO NOT UPDATE - These are UI placeholders for users

### 4. Login Form

**File:** `src/components/Auth/LoginForm.tsx`

```tsx
Line 65: placeholder="you@example.com"
         # ✅ KEEP AS-IS: This is a hint shown in the email input field

Line 81: placeholder="••••••••"
         # ✅ KEEP AS-IS: This is a hint shown in the password field
```

**Why keep?** These guide users when they log in. They're not your data!

---

### 5. Create Project Form

**File:** `src/components/Projects/CreateProject.tsx`

```tsx
Line 161: placeholder="https://github.com/username/repository"
          # ✅ KEEP AS-IS: Example URL format for users

Line 175: placeholder="My Website"
          # ✅ KEEP AS-IS: Example project name

Line 191: placeholder="main"
          # ✅ KEEP AS-IS: Suggests default branch name

Line 206: placeholder="ghp_..."
          # ✅ KEEP AS-IS: Shows GitHub token format
```

**Why keep?** These help users understand what to enter in each field.

---

### 6. Deploy Modal

**File:** `src/components/Editor/DeployModal.tsx`

```tsx
Line 216: placeholder="Describe your changes..."
          # ✅ KEEP AS-IS: Prompts users to write commit message
```

**Why keep?** Guides users when they're deploying changes.

---

### 7. Content Editor

**File:** `src/components/Editor/ContentEditor.tsx`

```tsx
Line 201: placeholder="Search content..."
          # ✅ KEEP AS-IS: Shows in search box
```

**Why keep?** Tells users they can search their content.

---

### 8. Text Extractor Service

**File:** `src/services/textExtractor.service.ts`

```tsx
Line 38, 85: { pattern: /placeholder="([^"]*)"/g, type: 'attribute-placeholder' }
             # ✅ KEEP AS-IS: This is CODE that extracts placeholders from HTML
```

**Why keep?** This is functional code that finds placeholder attributes in user's HTML files.

---

## 📊 Summary Table

| File | Line(s) | Content | Action | Priority |
|------|---------|---------|--------|----------|
| `.env` | - | Supabase credentials | ❌ CREATE & ADD REAL DATA | 🔴 Critical |
| `package.json` | 7 | Author name/email | ❌ Update with your info | 🟡 Recommended |
| `package.json` | 9-10 | Repository URL | ❌ Update with your GitHub | 🟡 Recommended |
| `README.md` | 123 | Clone URL | ❌ Update GitHub username | 🟡 Recommended |
| `README.md` | Bottom | Contact section | ❌ Add your contact info | 🟡 Recommended |
| `LoginForm.tsx` | 65, 81 | Input placeholders | ✅ Keep as-is | 🟢 No action |
| `CreateProject.tsx` | 161, 175, 191, 206 | Form placeholders | ✅ Keep as-is | 🟢 No action |
| `DeployModal.tsx` | 216 | Commit placeholder | ✅ Keep as-is | 🟢 No action |
| `ContentEditor.tsx` | 201 | Search placeholder | ✅ Keep as-is | 🟢 No action |
| `textExtractor.service.ts` | 38, 85 | Code patterns | ✅ Keep as-is | 🟢 No action |

---

## 🎯 Quick Action List

### To Run Locally:
1. ✅ Create `.env` with Supabase credentials
2. ✅ Run database migration
3. ✅ `npm install`
4. ✅ `npm run dev`

### To Deploy Properly:
5. ⚠️ Update `package.json` author and repository
6. ⚠️ Update `README.md` GitHub URLs
7. ⚠️ Update `README.md` contact section

### Don't Touch:
- ❌ Any `placeholder=` in component files
- ❌ Text extractor patterns
- ❌ UI hint text

---

## 💡 Understanding the Difference

### YOUR Data (Must Update)
- Configuration that identifies YOU as the creator
- Credentials for YOUR Supabase account
- Links to YOUR GitHub repository

### UI Placeholders (Don't Update)
- Text that appears in empty input fields
- Examples showing users what format to use
- Hints that disappear when users start typing

### Code Patterns (Don't Update)
- Regular expressions that extract content
- Functional code that makes the app work

---

## 🔍 How to Verify You're Done

Run these searches in your code editor:

1. **Search for:** `yourusername`
   - Should find: README.md, package.json
   - Action: Replace with your GitHub username

2. **Search for:** `your-email@example.com`
   - Should find: package.json
   - Action: Replace with your real email
   
3. **Search for:** `Your Name`
   - Should find: package.json
   - Action: Replace with your real name

4. **Search for:** `placeholder=`
   - Should find: Multiple .tsx files
   - Action: ⚠️ LEAVE THEM ALONE! These are UI elements

5. **Check:** `.env` file exists
   - Should: Exist with real Supabase credentials
   - If not: Create it now!

---

## ❓ Still Confused?

### "I found 'example.com' in LoginForm.tsx - do I update it?"
**No!** That's `placeholder="you@example.com"` - it's a UI hint. Leave it.

### "I found 'yourusername' in README.md - do I update it?"
**Yes!** That's in documentation showing people how to clone. Update it.

### "I found 'placeholder' in textExtractor.service.ts - do I update it?"
**No!** That's code that extracts placeholder attributes from HTML. It's functional code.

### "Do I need a real .env file?"
**YES! Absolutely!** The app will not work without it. Create it first.

---

## ✅ Final Checklist

- [ ] Created `.env` file with real Supabase credentials
- [ ] Verified `.env` is in `.gitignore` (it is!)
- [ ] Updated package.json author to your name
- [ ] Updated package.json repository to your GitHub URL
- [ ] Updated README.md clone command with your GitHub username
- [ ] Updated README.md contact section with your info
- [ ] Left all `placeholder=` attributes unchanged in component files
- [ ] Left textExtractor.service.ts patterns unchanged
- [ ] Ran database migration in Supabase
- [ ] Tested with `npm run dev`

---

**Now you're ready! 🚀**

