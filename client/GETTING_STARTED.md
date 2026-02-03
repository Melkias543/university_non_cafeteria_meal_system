# 🚀 Getting Started - University Digital Meal System

## Prerequisites

Before you begin, ensure you have:
- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- A modern web browser

---

## 📥 Installation

### Step 1: Navigate to Project Folder
```bash
cd client
```

### Step 2: Install Dependencies
```bash
npm install
```
This will install all required packages (~248 packages).

---

## 🎮 Running the Application

### Development Mode
```bash
npm run dev
```

The app will start at: **http://localhost:5000**

You should see:
```
VITE v7.3.1  ready in 838 ms
➜  Local:   http://localhost:5000/
```

---

## 🔐 Login & Demo

### Student Login
1. Open http://localhost:5000
2. Select a student from the dropdown:
   - Alice Johnson (STU-001) - Balance: $50.00
   - Bob Smith (STU-002) - Balance: $35.50
   - Carol Davis (STU-003) - Balance: $20.00
   - David Wilson (STU-004) - Balance: $15.75
   - Emma Brown (STU-005) - Balance: $8.25
3. Click "Continue to Dashboard"

### Admin Login
1. Open http://localhost:5000
2. Click "Access Admin Panel"
3. Full system access granted

---

## 🎯 What to Try

### As a Student:
1. **Dashboard** - View your balance and recent orders
2. **Menu** - Browse available meals
3. **Order** - Place a new meal order
4. **History** - See all your past orders

### As an Admin:
1. **Dashboard** - System overview
2. **Students** - Add/edit students, top up balances
3. **Menu** - Manage menu items
4. **Orders** - Approve/reject pending orders
5. **Reports** - View revenue analytics

---

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run TypeScript type checking |

---

## 📂 Project Structure

```
client/
├── src/
│   ├── pages/          # All page components
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state management
│   └── lib/            # Utilities & dummy data
├── public/             # Static assets
└── package.json        # Dependencies & scripts
```

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 is busy:
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change the port in vite.config.ts
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Run type checking
npm run check

# If errors persist, restart your editor
```

### Vite Not Starting
```bash
# Make sure you're in the client folder
pwd  # Should show: .../client

# Check Node.js version
node --version  # Should be 18+
```

---

## 🎨 Customization

### Change Colors
Edit `src/index.css` - look for CSS variables:
```css
:root {
  --primary: 224 76% 40%;    /* Deep Blue */
  --accent: 43 96% 56%;      /* Amber */
  /* ... more colors */
}
```

### Add New Pages
1. Create file in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in layout component

### Modify Dummy Data
Edit `src/lib/initialData.ts`:
- `INITIAL_STUDENTS` - Student accounts
- `INITIAL_MENU` - Menu items
- `INITIAL_ORDERS` - Order history

---

## 📱 Mobile Testing

### Test on Your Phone
1. Start dev server: `npm run dev`
2. Note the Network URL (e.g., `http://192.168.1.100:5000`)
3. Open that URL on your phone (same WiFi network)

### Responsive Design
- Desktop: Full sidebar
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` folder.

### Deploy Options
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **Any Static Host**: Upload `dist/` contents

---

## 📚 Learn More

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

---

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **Console**: Open browser DevTools (F12) to see logs
3. **Network Tab**: Monitor API calls (none in this demo)
4. **React DevTools**: Install browser extension for debugging

---

## ❓ Need Help?

- Check `README.md` for detailed documentation
- Review `PROJECT_STRUCTURE.md` for architecture
- Inspect code comments in source files
- Search for similar issues online

---

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] App opens at http://localhost:5000
- [ ] Can login as student
- [ ] Can login as admin
- [ ] No console errors

---

**Happy Coding! 🎉**
