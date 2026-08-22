# Scanify

> A clean, modern QR code platform for generating, managing, organizing, and sharing QR codes directly from the browser.

**Scanify** is a frontend-first QR code management platform built with HTML, CSS, and JavaScript. It provides a complete dashboard experience for creating and organizing QR codes, managing favorites and history, customizing settings, and tracking local scan-related activity.

The current version is **frontend-only** and uses browser storage for local data persistence. A production backend is planned for future versions.

---

## ✨ Features

### 🔐 Authentication

* User signup and login
* Remember Me functionality
* Protected dashboard routes
* Browser-based session management
* Password change flow
* Logout functionality

### 📱 QR Code Generator

Generate QR codes for:

* 🔗 URL
* 📝 Text
* 💬 WhatsApp
* 📶 WiFi

Additional functionality includes:

* Live QR preview
* Custom QR color
* Download QR codes
* Save generated QR codes
* Share QR codes using the Web Share API where supported

### 📂 QR Management

* View saved QR codes
* Organize generated QR codes
* Favorite important QR codes
* Delete QR codes
* Preview saved QR codes
* Download saved QR codes

### 📊 Tracking & History

* Local scan-related records
* Activity history
* QR-related activity logs
* History management

> **Note:** Real-world scan analytics are not available yet because Scanify currently does not have a backend.

### 👤 Profile & Settings

* User profile
* Profile avatar shortcut
* Default QR color settings
* Password update functionality
* Application preferences

### ❓ Help & FAQ

* Built-in help section
* Frequently asked questions
* User-friendly guidance for using Scanify

### 🎨 UI & UX

* Modern dark-themed interface
* Responsive design
* Clean dashboard layout
* Toast notifications
* Mobile-friendly interface
* Phosphor Icons
* Consistent component-based UI structure

---

## 🖥️ Pages

| Page        | Description                          |
| ----------- | ------------------------------------ |
| Landing     | Scanify introduction and entry point |
| Login       | User authentication                  |
| Signup      | New user registration                |
| Dashboard   | Main application dashboard           |
| Create QR   | QR code generation                   |
| My QR Codes | Saved QR code management             |
| Favorites   | Favorite QR codes                    |
| Track       | Local scan/tracking section          |
| History     | Activity history                     |
| Profile     | User profile                         |
| Help & FAQ  | Help and frequently asked questions  |
| Settings    | Application and account settings     |

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)
* ES Modules

### Browser APIs & Storage

* `localStorage`
* `sessionStorage`
* Web Share API

### Libraries

* [QRCode.js](https://github.com/davidshimjs/qrcodejs)
* [Phosphor Icons](https://phosphoricons.com/)

### Development

* Node.js
* npm
* Git
* GitHub

---

## 📁 Project Structure

```text
Scanify/
│
├── src/
│   ├── components/
│   │   └── Shared layout and reusable UI logic
│   │
│   ├── pages/
│   │   └── Page-specific JavaScript
│   │
│   ├── utils/
│   │   ├── Router utilities
│   │   ├── Storage utilities
│   │   ├── Toast utilities
│   │   └── Tracking utilities
│   │
│   ├── views/
│   │   └── HTML views loaded by the router
│   │
│   └── styles.css
│
├── index.html
├── package.json
├── serve.ps1
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* Git installed

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

### 2. Navigate into the project

```bash
cd Scanify
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

---

## ⚠️ Why a Local Server Is Required

Scanify uses JavaScript `fetch()` requests to dynamically load application views.

Therefore, opening:

```text
file://...
```

directly in the browser will not work correctly.

Use the provided local server instead:

```bash
npm start
```

Alternatively, on PowerShell:

```powershell
./serve.ps1
```

---

## 💾 Data Storage

The current version of Scanify stores application data locally in the user's browser.

Stored information includes:

* Registered users
* Current login session
* Generated QR codes
* Favorite QR codes
* Activity history
* Application settings
* Local scan records

### localStorage

Persistent application data is stored using:

```javascript
localStorage
```

This allows data to remain available after closing and reopening the browser.

### sessionStorage

When **Remember Me** is disabled, the temporary login session uses:

```javascript
sessionStorage
```

The session ends when the browser session is closed.

---

## 🔐 Authentication Note

The current authentication system is designed for **frontend demonstration and learning purposes**.

Because Scanify does not currently have a backend:

* User accounts are stored locally
* Password data is stored with browser-based application data
* Authentication is not suitable for production security
* Accounts do not sync between devices
* Clearing browser storage can remove account/application data

**Do not use real or sensitive passwords with the current frontend-only version.**

A secure backend authentication system is planned for the production architecture.

---

## ☁️ Planned Backend Architecture

The next major version of Scanify will introduce a backend and database.

Planned improvements include:

* Secure user authentication
* Database-backed user accounts
* Cloud QR code storage
* Cross-device synchronization
* Real QR scan tracking
* Analytics dashboard
* Secure password hashing
* Server-side authorization
* Account management
* Persistent user profiles

The backend will replace the current browser-only storage architecture.

---

## 📈 Future Roadmap

### Phase 1 — Frontend

* [x] QR generation
* [x] Authentication UI
* [x] Dashboard
* [x] QR management
* [x] Favorites
* [x] History
* [x] Settings
* [x] Profile
* [x] Help & FAQ
* [x] Responsive UI

### Phase 2 — Backend

* [ ] Backend API
* [ ] Database
* [ ] Secure authentication
* [ ] Password hashing
* [ ] Server-side sessions/JWT
* [ ] Cloud QR storage

### Phase 3 — Analytics

* [ ] Real scan tracking
* [ ] Scan analytics
* [ ] Device analytics
* [ ] Location analytics
* [ ] QR performance dashboard

### Phase 4 — Production

* [ ] Cross-device synchronization
* [ ] Account recovery
* [ ] Production security hardening
* [ ] Advanced QR customization
* [ ] Custom QR branding

---

## 🌐 Deployment

Scanify can be deployed as a static frontend application on platforms such as:

* Vercel
* Netlify
* GitHub Pages
* Other static hosting providers

For the current frontend-only version, no backend server is required after deployment.

---

## 🔎 SEO & Production Readiness

The production release will include SEO and discoverability improvements such as:

* Descriptive page title
* Meta description
* Canonical URL
* Open Graph metadata
* Social sharing metadata
* `robots.txt`
* `sitemap.xml`
* Semantic HTML
* Structured data where appropriate
* Optimized page performance
* Mobile-friendly responsive design

> The application dashboard itself is primarily an interactive web application, so SEO efforts should focus mainly on the public landing page and other crawlable public content rather than private dashboard routes.

---

## 🧪 Browser Compatibility

Scanify is designed for modern browsers supporting:

* ES Modules
* Local Storage
* Session Storage
* Fetch API
* Web Share API where available

The Web Share functionality may not be available in every browser. Scanify falls back gracefully where the API is unsupported.

---

## 👨‍💻 Author

**Tejas Chamola**

Computer Science Engineering Student & Full-Stack Developer

---

## 📄 License

This project is created for **learning, experimentation, and portfolio purposes**.

You are welcome to explore the source code and use it as a reference for learning frontend application architecture.

---

## ⭐ Project Status

**Current Status:** Frontend MVP / Portfolio Project

**Backend:** Planned

**Database:** Planned

**Real Scan Analytics:** Planned

**Cross-device Sync:** Planned

---

> Built with ❤️ by **Tejas Chamola**
