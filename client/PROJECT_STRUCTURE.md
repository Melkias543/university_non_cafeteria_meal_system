# 🎯 Project Structure - University Digital Meal System

## ✅ Complete Self-Contained Frontend Application

This is a **100% frontend-only** React application with all dependencies, configurations, and source code contained within this folder.

---

## 📁 Folder Structure

```
client/
├── node_modules/           # All npm dependencies (auto-generated)
├── public/                 # Static assets
│   ├── favicon.png        # App icon
│   └── opengraph.jpg      # Social media preview image
├── src/                    # Source code
│   ├── components/        # React components
│   │   ├── layout/        # Layout wrappers (StudentLayout, AdminLayout)
│   │   └── ui/            # Reusable UI components (buttons, cards, etc.)
│   ├── context/           # React Context providers
│   │   └── DataContext.tsx # Global state management
│   ├── hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/               # Utility functions
│   │   ├── initialData.ts # Dummy data for demo
│   │   ├── queryClient.ts # React Query setup
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Reports.tsx
│   │   │   └── Students.tsx
│   │   ├── student/       # Student portal pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Menu.tsx
│   │   │   └── Order.tsx
│   │   ├── Login.tsx      # Login page
│   │   └── not-found.tsx  # 404 page
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles & Tailwind config
├── .gitignore             # Git ignore rules
├── components.json        # Shadcn UI configuration
├── index.html             # HTML template
├── package.json           # Project dependencies & scripts
├── package-lock.json      # Locked dependency versions
├── postcss.config.js      # PostCSS configuration
├── README.md              # Project documentation
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build tool configuration
```

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
App will be available at: **http://localhost:5000**

### Build for Production
```bash
npm run build
```
Output will be in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

### Type Check
```bash
npm run check
```

---

## 📦 Key Dependencies

### Core Framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### Styling
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Framer Motion** - Animations

### State & Forms
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **React Context** - Global state

### Routing & Navigation
- **Wouter** - Lightweight routing

### Special Features
- **React QR Code** - QR code generation
- **Recharts** - Charts & graphs
- **Sonner** - Toast notifications

---

## 🎨 Design System

### Color Palette
```css
Primary (Deep Blue):    #1E40AF
Accent (Amber):         #FBBF24
Success (Green):        #10B981
Destructive (Red):      #DC2626
Background:             #F9FAFB
Foreground:             #1F2937
```

### Typography
- **Headings**: Merriweather (serif)
- **Body**: Inter (sans-serif)

---

## 🔧 Configuration Files

### vite.config.ts
- React plugin enabled
- Tailwind CSS integration
- Path aliases (`@/` → `src/`)
- Dev server on port 5000

### tsconfig.json
- Strict mode enabled
- Path aliases configured
- ESNext module system
- DOM types included

### package.json
Scripts:
- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `check` - Run TypeScript type checking

---

## 📊 Data Management

All data is managed through **React Context** (`DataContext.tsx`):

### State
- `students[]` - Student accounts
- `menu[]` - Menu items
- `orders[]` - Order history
- `currentUser` - Current session

### Actions
**Student:**
- `placeOrder()` - Create new order
- `getStudent()` - Get student details

**Admin:**
- `addStudent()` - Add new student
- `updateStudentBalance()` - Top up balance
- `deleteStudent()` - Remove student
- `addMenuItem()` - Add menu item
- `updateMenuItem()` - Edit menu item
- `deleteMenuItem()` - Remove menu item
- `updateOrderStatus()` - Approve/reject orders

---

## 🎯 Features

### Student Portal
✅ Dashboard with balance & recent orders
✅ Browse menu with categories
✅ Place orders with cart
✅ View order history
✅ Generate QR codes for pickup
✅ Real-time balance tracking

### Admin Portal
✅ System overview dashboard
✅ Student management (CRUD)
✅ Balance top-up system
✅ Menu management (CRUD)
✅ Order approval workflow
✅ Revenue reports & analytics

---

## 🔐 Demo Mode

The app runs with **dummy data** for demonstration:

### Login Options
1. **Student Login**: Select from pre-loaded students
2. **Admin Login**: Direct access to admin panel

### Sample Data
- 5 pre-loaded students
- 12 menu items across 4 categories
- Sample order history

---

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Bottom navigation (student) / Hamburger menu (admin)

---

## 🚫 What's NOT Included

This is a **frontend-only** application. It does NOT include:
- ❌ Backend server
- ❌ Database
- ❌ API endpoints
- ❌ Authentication system
- ❌ Payment processing
- ❌ Email notifications

All data is stored in **memory** and resets on page refresh.

---

## 🔄 Future Backend Integration

To connect to a real backend:

1. Update `DataContext.tsx` to use API calls
2. Replace dummy data with API endpoints
3. Add authentication tokens
4. Implement error handling
5. Add loading states

---

## 📝 Notes

- All TypeScript types are defined in `src/types/index.ts`
- Global styles use Tailwind CSS custom properties
- Components follow Radix UI accessibility standards
- Code is formatted with Prettier (recommended)
- ESLint configuration recommended for production

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

**Built with ❤️ for modern university campuses**
