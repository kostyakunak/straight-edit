# StraightEdit

> **Empower your clients to edit their own website content - no coding required!**

StraightEdit is a SaaS platform that allows anyone to edit text content on GitHub-hosted static websites through a simple, intuitive interface. Perfect for freelancers who want to deliver websites that clients can update themselves.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://straight-edit.vercel.app)
[![GitHub](https://img.shields.io/github/stars/kostyakunak/straight-edit?style=social)](https://github.com/kostyakunak/straight-edit)

---

## 🎯 What is StraightEdit?

StraightEdit is a visual content editor that connects directly to GitHub repositories. It extracts all text content from website files and presents it in an easy-to-use editor, eliminating the need to touch any code.

**Think of it as a bridge between GitHub and your non-technical clients.**

### 🌐 See it live
- **Live site:** [straight-edit.vercel.app](https://straight-edit.vercel.app)
- **Hosted on:** Vercel (global CDN, HTTPS, auto-deploys)
- **Backend:** Supabase (database + auth)
- **Repository:** [GitHub](https://github.com/kostyakunak/straight-edit)

---

## 💡 The Problem We Solve

### For Freelancers & Agencies

You just built a beautiful static website for a client. It's hosted on GitHub Pages (or Netlify/Vercel). Your client asks:

> *"Can I update the text on my homepage myself?"*

**Without StraightEdit:**
- Client needs to learn Git, GitHub, HTML/Markdown
- Risk of breaking the website
- You handle every small text change request
- Time-consuming and frustrating for everyone

**With StraightEdit:**
- ✅ Client logs in to a simple web interface
- ✅ Sees all website text in plain language
- ✅ Edits content like editing a document
- ✅ Clicks "Deploy" - changes go live
- ✅ No code knowledge required!

---

## 👥 Who is StraightEdit For?

### Perfect for:

- **Freelancers** on Upwork, Fiverr, or other platforms building static sites
- **Web agencies** managing multiple client websites
- **Developers** who want to deliver self-serviceable websites
- **Small businesses** with static websites who want editing control

### Benefits:

**For Service Providers:**
- 💰 Charge more for "client-editable websites"
- ⏰ Stop handling "Can you change this text?" requests
- 😊 Deliver empowered, satisfied clients
- ⭐ Get better reviews and referrals

**For End Users (Your Clients):**
- 🎨 Easy to use - familiar interface
- 🔒 Safe - can't accidentally break the website
- ⚡ Fast - no backend servers, instant updates
- 💵 Cost-effective - no complex CMS needed

---

## ✨ Key Features

### 🔍 Smart Content Extraction
- Automatically finds all text content in HTML, JSX, TSX, and Markdown files
- Filters out code, styles, and technical elements
- Presents only editable content to users

### ✏️ Visual Editor
- Clean, distraction-free editing interface
- Real-time content preview
- Edit multiple sections in one session

### 🚀 Direct GitHub Integration
- Changes deploy directly to GitHub repository
- Automatic commit messages
- Works with GitHub Pages, Netlify, Vercel, and other static hosts

### 🔐 Secure Access
- User authentication system
- Personal Access Token integration
- Multi-tenant architecture

### 📱 Modern Interface
- Responsive design - works on desktop and mobile
- Built with React and Tailwind CSS
- Fast and lightweight

---

## 🎓 How It Works

```
Freelancer creates account
  ↓
Imports client's GitHub repository
  ↓
StraightEdit extracts all text content
  ↓
Shares access with client
  ↓
Client edits content through simple interface
  ↓
Client clicks "Deploy to GitHub"
  ↓
Changes automatically pushed to repository
  ↓
Website updates automatically (GitHub Pages/Netlify/Vercel)
```

---

## 💼 Use Cases

### 1. Portfolio Websites
Freelancer builds a portfolio site. Client can update project descriptions, testimonials, and contact info without calling you.

### 2. Small Business Sites
Agency delivers a company website. Business owner can update opening hours, services, and announcements independently.

### 3. Landing Pages
Developer creates product landing pages. Marketing team can update copy and CTAs without developer involvement.

### 4. Documentation Sites
Technical writer can update documentation hosted on GitHub Pages without learning Git commands.

---

## 🎁 Benefits for Freelancers

### 💰 Charge Premium Prices
Offer "client-editable websites" as a premium feature. Clients gladly pay more for independence.

### ⏰ Save Countless Hours
Stop being your client's content editor. No more "change this text" emails at midnight.

### 😊 Deliver Happier Clients
Empower clients with control over their content. They feel independent and satisfied.

### 🔄 Create Recurring Revenue
Offer StraightEdit as part of maintenance packages or monthly retainers.

### ⭐ Get Better Reviews
*"The developer gave us a website we can actually update ourselves!"* - Every 5-star review

---

## 🌟 Real-World Example

**Scenario:** You built a restaurant website using React, deployed on Netlify via GitHub.

**Before StraightEdit:**
- Client emails: "Can you change the menu prices?"
- You: Open IDE → Find component → Edit → Commit → Push
- Time spent: 15-30 minutes per request
- Client satisfaction: Dependent and frustrated

**After StraightEdit:**
- Client logs in → Finds menu section → Updates prices → Clicks deploy
- Time spent: 2 minutes
- Your involvement: Zero
- Client satisfaction: Independent and empowered
- Your time saved: **Priceless**

---

## 🛡️ Security & Best Practices

### For Service Providers

- **Create separate client accounts** - Multi-tenant isolation
- **Use limited GitHub tokens** - Only grant necessary repository permissions
- **Backup repositories** - Always maintain backups before client edits
- **Set up branch protection** - Use separate branches for client edits if needed

### For End Users

- **Strong passwords** - Secure StraightEdit accounts
- **Preview before deploying** - Review changes before pushing live
- **Clear commit messages** - Track what changed and when

---

## 🔧 Technical Architecture

### Built With

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite
- **GitHub Integration**: GitHub REST API
- **Hosting**: Railway / Vercel / Netlify ready

### Supported File Types

StraightEdit can extract content from:
- `.html` - HTML files
- `.jsx` / `.tsx` - React component files
- `.md` / `.mdx` - Markdown files
- Any text-based files with readable content

### System Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ (React SPA)
       │
┌──────▼──────┐      ┌──────────────┐
│  Railway    │      │    GitHub    │
│  (Backend)  │◄────►│     API      │
│  Supabase   │      │              │
│  (Auth+DB)  │      └──────────────┘
└─────────────┘
```

---

## 📊 Pricing Model (Example)

### For Freelancers / Agencies

**Starter Plan** - $19/month
- Up to 5 projects
- Unlimited edits
- Basic support

**Professional Plan** - $49/month
- Up to 20 projects
- Unlimited edits
- Priority support
- Custom branding

**Agency Plan** - $99/month
- Unlimited projects
- Unlimited edits
- White-label option
- Dedicated support

---

## 🚀 Deployment Options

StraightEdit is designed to be deployed as a SaaS platform on:

- **Railway** - Recommended for easy deployment
- **Vercel** - Great for global performance
- **Netlify** - Simple and reliable
- **Your own infrastructure** - Full control

The application uses Supabase for authentication and database, which provides:
- Built-in user management
- Secure authentication
- PostgreSQL database
- Real-time subscriptions

---

## 📈 Roadmap

- [ ] Team collaboration features
- [ ] Version history and rollback
- [ ] Custom domains for clients
- [ ] White-label solution
- [ ] API access for integrations
- [ ] Advanced content validation
- [ ] Multi-language support
- [ ] WordPress migration tool

---

## 🤝 Contributing

We welcome contributions! If you have ideas for improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support & FAQ

### Common Questions

**Q: Is this a SaaS or self-hosted?**
A: StraightEdit is designed as a SaaS platform, but can also be self-hosted.

**Q: Do clients need GitHub accounts?**
A: No! Clients only need StraightEdit login credentials. GitHub integration happens behind the scenes.

**Q: Will clients see code?**
A: No. StraightEdit only shows extracted text content, never code or markup.

**Q: Can clients break the website?**
A: Very unlikely. StraightEdit only edits text content, not structure or code. However, always maintain backups!

**Q: Does it work with WordPress?**
A: No. StraightEdit is designed for static sites hosted on GitHub (HTML, React, Vue, Next.js, etc.).

**Q: Can multiple people edit at once?**
A: Yes, but be careful with conflicts. Changes are deployed to GitHub in order.

**Q: What about performance?**
A: Static sites are extremely fast. StraightEdit doesn't add any runtime overhead to your websites.

---

## 📞 Contact & Links

- **Author**: Konstantin Kunak
- **Email**: kostyakunak@gmail.com
- **GitHub**: https://github.com/kostyakunak/straight-edit
- **Issues**: https://github.com/kostyakunak/straight-edit/issues
- **Demo**: Coming soon!

---

## 🎯 Why Choose StraightEdit?

### Unlike Traditional CMS:
- ✅ No database required
- ✅ No server maintenance
- ✅ Lightning-fast performance
- ✅ Free hosting (GitHub Pages)
- ✅ Version control included

### Unlike Manual Editing:
- ✅ No code knowledge needed
- ✅ Can't break the website structure
- ✅ Safe and user-friendly
- ✅ No IDE or developer tools needed

### Unlike Other Solutions:
- ✅ Specifically designed for freelancers
- ✅ Works with existing GitHub workflows
- ✅ No vendor lock-in
- ✅ Affordable and scalable

---

**Made with ❤️ for freelancers who want to deliver better client experiences**

*Stop being your clients' content editor. Give them the tools to do it themselves.*

---

## 🌐 Live Platform

**Live now:** StraightEdit is available as a hosted SaaS platform.

Visit: [straight-edit.vercel.app](https://straight-edit.vercel.app)

---

**Star this repo ⭐ if you think StraightEdit is useful for your freelance business!**

---

## 🛠️ Technologies Used

### Frontend
- **React 18** — современный UI фреймворк
- **TypeScript** — типизированный JavaScript для надежности
- **Tailwind CSS** — быстрая стилизация без CSS файлов
- **Vite** — быстрый сборщик и dev-сервер

### Backend & Infrastructure
- **Supabase** — база данных PostgreSQL + аутентификация + API
- **Vercel** — хостинг фронтенда с глобальным CDN
- **GitHub API** — интеграция с репозиториями

### Development & Deployment
- **Git** — контроль версий
- **GitHub** — хранение кода
- **Vercel** — автоматические деплои при каждом push

---

## 🎬 How It Works in Practice

### 1. **Freelancer Setup** (2 minutes)
1. Freelancer logs in to [straight-edit.vercel.app](https://straight-edit.vercel.app)
2. Clicks "New Project"
3. Enters GitHub repository URL (e.g., `https://github.com/client/website`)
4. Adds GitHub Personal Access Token
5. Project is imported and ready!

### 2. **Client Usage** (30 seconds)
1. Client gets login credentials from freelancer
2. Client logs in to [straight-edit.vercel.app](https://straight-edit.vercel.app)
3. Sees their website content in plain text
4. Edits any text they want
5. Clicks "Deploy" — changes go live instantly!

### 3. **Real Example**
**Before:** Client emails "Can you change the menu prices?"
**After:** Client logs in → finds menu → updates prices → clicks deploy

**Time saved:** 15-30 minutes per request
**Client satisfaction:** Independent and empowered

---

## 🌐 Where Everything Lives

- **Website:** [straight-edit.vercel.app](https://straight-edit.vercel.app) (Vercel hosting)
- **Code:** [github.com/kostyakunak/straight-edit](https://github.com/kostyakunak/straight-edit)
- **Database:** Supabase (PostgreSQL in the cloud)
- **Authentication:** Supabase Auth
- **File Storage:** GitHub repositories
- **CDN:** Vercel Edge Network (global)

**All services are production-ready and scalable.**
