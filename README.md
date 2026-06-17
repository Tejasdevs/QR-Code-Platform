# Scanify

Scanify is a clean, dark-themed QR code platform for generating, saving, managing, sharing, and organizing QR codes directly in the browser.

The project is currently frontend-only and uses browser storage for authentication sessions, QR data, history, favorites, settings, and scan-related data.

## Important Note

This project does not have a backend yet.

All data is stored in the user's browser. Persistent app data is stored with localStorage, and temporary login sessions use sessionStorage when Remember Me is not enabled. That means accounts, QR codes, favorites, history, settings, and scan data are local to the current browser/device.

Backend integration is planned for the future. A backend will later be added for real user accounts, database storage, real scan analytics, secure authentication, and cross-device data sync.

## Features

- User signup and login flow
- Remember Me login sessions
- Protected dashboard pages
- QR code generator
- Supported QR types:
  - URL
  - Text
  - WhatsApp
  - WiFi
- Manage saved QR codes
- QR preview and download
- Share QR codes using the Web Share API where supported
- Favorites page for important QR codes
- History page for activity logs
- Profile page with user information
- Settings page for default QR color
- Help and FAQ section
- Toast notifications for clean success/error feedback
- Responsive dark UI

## Pages

- Landing page
- Login
- Signup
- Dashboard
- Create QR
- My QR Codes
- Favorites
- Track
- History
- Profile
- Help and FAQ
- Settings

## Tech Stack

- HTML
- CSS
- JavaScript
- ES Modules
- localStorage
- sessionStorage
- Phosphor Icons
- QRCode.js

## Local Setup

This app must be served through a local HTTP server. Opening `index.html` directly with `file://` will not work because the app loads views using `fetch()`.

### Option 1: Node.js

Install dependencies:

```bash
npm install
```

Start the local server:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

### Option 2: PowerShell Server

From the project root:

```powershell
./serve.ps1
```

Then open the URL shown in the terminal.

## Project Structure

```text
src/
  components/     Shared layout logic
  pages/          Page-specific JavaScript
  utils/          Router, storage, toast, tracking helpers
  views/          HTML views loaded by the router
  styles.css      Main styling
index.html        App entry point
package.json      Local server scripts
serve.ps1         PowerShell local server
```

## Data Storage

Scanify currently stores data in browser storage. Main stored data includes:

- Registered users
- Current logged-in user session
- Generated QR codes
- Favorite QR codes
- Activity history
- App settings
- Local scan records

Remember Me behavior:

- Enabled: the user session is stored persistently and remains active until manual logout.
- Disabled: the user session is temporary and ends when the browser session closes.

Because there is no backend yet, clearing browser data will remove saved Scanify data from that browser.

## Upcoming Backend Plan

The backend will be integrated later. Planned backend improvements include:

- Secure authentication
- User database
- Cloud-saved QR codes
- Real scan tracking
- Cross-device access
- Better analytics
- Account management

## Author

Built by Tejas Chamola.

## License

This project is for learning and portfolio use.
