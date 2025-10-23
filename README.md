# StraightEdit

> **Empower your clients to edit their own website content - no coding required!**

StraightEdit is a web-based content management tool that allows anyone to edit text content on GitHub-hosted static websites through a simple, intuitive interface. Perfect for freelancers who want to deliver websites that clients can update themselves.

---

## 🎯 What is StraightEdit?

StraightEdit is a visual content editor that connects directly to your GitHub repository. It extracts all text content from your website files and presents it in an easy-to-use editor, eliminating the need to touch any code.

**Think of it as a bridge between GitHub and your non-technical clients.**

---

## 💡 Why StraightEdit?

### The Problem

You're a freelancer who just built a beautiful static website for a client. The project is hosted on GitHub Pages (or similar). Your client asks:

> *"Can I update the text on my homepage myself?"*

Without StraightEdit, they would need to:
- Learn Git and GitHub
- Understand HTML/Markdown
- Navigate through code files
- Risk breaking the website

### The Solution

With StraightEdit:
1. ✅ Client logs in to a simple web interface
2. ✅ Sees all website text in plain English
3. ✅ Edits content like editing a document
4. ✅ Clicks "Deploy" - changes go live on GitHub
5. ✅ No code knowledge required!

---

## 👥 Who is StraightEdit For?

### Perfect for Freelancers & Agencies

- **Web developers** building static sites for clients
- **Freelancers** on Upwork, Fiverr, or other platforms
- **Digital agencies** managing multiple client websites
- **Anyone** who wants to deliver editable websites without complex CMS setup

### Benefits for Your Clients

- **Easy to use** - familiar interface, like editing a Word document
- **Safe** - can't accidentally break the website structure
- **Fast** - no backend servers, no databases, just simple content editing
- **Cost-effective** - no monthly CMS fees or hosting complications

---

## ✨ Key Features

### 🔍 Smart Content Extraction
- Automatically finds all text content in HTML, JSX, TSX, and Markdown files
- Filters out code, styles, and technical elements
- Presents only editable content to users

### ✏️ Visual Editor
- Clean, distraction-free editing interface
- Real-time preview of changes
- Edit multiple sections in one session

### 🚀 Direct GitHub Integration
- Changes deploy directly to your GitHub repository
- Automatic commit messages
- Works with GitHub Pages, Netlify, Vercel, and other static hosts

### 🔐 Secure Access
- User authentication system
- Personal Access Token integration
- Each client has their own projects

### 📱 Modern Interface
- Responsive design works on desktop and mobile
- Built with React and Tailwind CSS
- Fast and lightweight

---

## 🎓 How It Works

```
1. Freelancer sets up StraightEdit
   ↓
2. Import client's GitHub repository
   ↓
3. StraightEdit extracts all text content
   ↓
4. Share login credentials with client
   ↓
5. Client edits content through simple interface
   ↓
6. Client clicks "Deploy to GitHub"
   ↓
7. Changes automatically pushed to repository
   ↓
8. Website updates automatically (GitHub Pages/Netlify/Vercel)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- A Supabase account (free tier works)
- GitHub Personal Access Token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kostyakunak/straight-edit.git
   cd straight-edit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   
   Execute the SQL migration file in your Supabase dashboard:
   ```
   supabase/migrations/20251023135854_create_content_editor_schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

---

## 📖 Usage Guide

### For Freelancers (Setting Up)

1. **Sign Up / Sign In**
   - Create an account or log in to StraightEdit

2. **Create a New Project**
   - Click "New Project"
   - Enter GitHub repository details:
     - Repository URL (e.g., `https://github.com/username/repo`)
     - Branch name (usually `main` or `gh-pages`)
     - GitHub Personal Access Token

3. **Share Access with Client**
   - Create a separate account for your client
   - Or share your credentials (create project-specific accounts for security)

### For Clients (Editing Content)

1. **Log In**
   - Access StraightEdit with provided credentials

2. **Select Your Project**
   - Click on your website project from the list

3. **Edit Content**
   - Browse through extracted text sections
   - Click on any text to edit
   - Make your changes

4. **Deploy Changes**
   - Click "Deploy to GitHub"
   - Add a commit message (e.g., "Updated homepage text")
   - Confirm deployment
   - Changes will be live in a few moments!

---

## 🔧 Technical Details

### Built With

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **GitHub Integration**: GitHub REST API

### Supported File Types

StraightEdit can extract content from:
- `.html` - HTML files
- `.jsx` / `.tsx` - React component files
- `.md` / `.mdx` - Markdown files
- Any text-based files with readable content

### Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ (React App)
       │
┌──────▼──────┐      ┌──────────────┐
│  Supabase   │◄────►│    GitHub    │
│  (Auth +    │      │     API      │
│  Database)  │      │              │
└─────────────┘      └──────────────┘
```

---

## 💼 Use Cases

### 1. Portfolio Websites
Freelancer builds a portfolio site. Client can update project descriptions, testimonials, and contact info.

### 2. Small Business Sites
Agency delivers a company website. Business owner can update opening hours, services, and announcements.

### 3. Landing Pages
Developer creates product landing pages. Marketing team can update copy and CTAs without developer involvement.

### 4. Documentation Sites
Tech writer can update documentation hosted on GitHub Pages without learning Git commands.

---

## 🎁 Benefits for Freelancers

### 💰 Charge More
Offer "client-editable websites" as a premium feature. Clients pay more for the ability to make their own updates.

### ⏰ Save Time
Stop handling "Can you change this text?" requests. Clients do it themselves.

### 😊 Happy Clients
Empower clients with independence. They feel in control and satisfied.

### 🔄 Recurring Value
Offer StraightEdit as part of maintenance packages or monthly retainers.

### ⭐ Better Reviews
"The developer gave us a website we can actually update ourselves!" - 5-star review

---

## 🛡️ Security & Best Practices

### For Freelancers

1. **Create separate client accounts** - Don't share your master account
2. **Use limited GitHub tokens** - Only grant necessary repository permissions
3. **Backup repositories** - Always have a backup before client edits
4. **Set up branch protection** - Use separate branches for client edits if needed

### For Clients

1. **Use strong passwords** - Protect your StraightEdit account
2. **Preview before deploying** - Always review changes before pushing
3. **Write clear commit messages** - Help track what changed and when

---

## 📝 Configuration

### Environment Variables

Create a `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### GitHub Token Permissions

Your GitHub Personal Access Token needs:
- ✅ `repo` - Full control of private repositories
- ✅ `public_repo` - Access to public repositories

Generate token at: https://github.com/settings/tokens

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve StraightEdit:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support & FAQ

### Common Questions

**Q: Do clients need GitHub accounts?**
A: No! Clients only need StraightEdit login credentials. The GitHub integration happens in the background.

**Q: Will clients see code?**
A: No. StraightEdit only shows extracted text content, not code or markup.

**Q: Can clients break the website?**
A: Very unlikely. StraightEdit only edits text content, not structure or code. However, always keep backups!

**Q: Does it work with WordPress?**
A: No. StraightEdit is designed for static sites hosted on GitHub (HTML, React, Vue, etc.).

**Q: Is it free?**
A: The tool is open-source. You'll need a Supabase account (free tier available) for hosting.

**Q: Can multiple people edit at once?**
A: Yes, but be careful with conflicts. Changes are deployed to GitHub in order.

---

## 🌟 Real-World Example

**Scenario**: You built a restaurant website using React and deployed it on Netlify via GitHub.

**Before StraightEdit**:
- Client emails: "Can you change the menu prices?"
- You: Open code → Find component → Edit prices → Commit → Push
- Time spent: 15-30 minutes
- Client dependency: 100%

**After StraightEdit**:
- Client logs in → Finds menu section → Updates prices → Clicks deploy
- Time spent: 2 minutes
- Client dependency: 0%
- Your time saved: Priceless

---

## 🚀 Getting Started Checklist

- [ ] Install Node.js and npm
- [ ] Create Supabase account
- [ ] Clone StraightEdit repository
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Start development server
- [ ] Create your first project
- [ ] Test editing and deploying
- [ ] Share with your first client
- [ ] Celebrate your independence! 🎉

---

## 📞 Contact & Links

- **GitHub**: https://github.com/kostyakunak/straight-edit
- **Issues**: https://github.com/kostyakunak/straight-edit/issues
- **Author**: Konstantin Kunak
- **Email**: kostyakunak@gmail.com

---

**Made with ❤️ for freelancers who want to deliver better client experiences**

*Stop being your clients' content editor. Give them the tools to do it themselves.*

