Local development server

Options to run the site locally (from project root):

- If you have Node.js + npm installed:

```bash
npm install
npm start
```

Then open http://localhost:3000

- If you don't have Node, with Python 3 installed:

```bash
cd "c:\Users\chamo\OneDrive\Desktop\tejas\QR Code Platform"
python -m http.server 8000
```

- On Windows without Python, use the bundled PowerShell server:

```powershell
cd "C:\Users\chamo\OneDrive\Desktop\tejas\QR Code Platform"
./serve.ps1
```

Then open http://localhost:8000

Notes:
- This project uses ES modules and `fetch()` to load views, so files must be served over HTTP (file:// will fail).
- If you still see errors, open the browser devtools console and share the error text and I'll fix code issues.