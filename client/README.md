# University Digital Meal System

A modern, professional frontend application for managing university meal orders, student accounts, and cafeteria operations.

## 🚀 Features

### Student Portal
- **Dashboard**: View balance, pending orders, and recent activity
- **Menu**: Browse available meals with images and descriptions
- **Order**: Place meal orders with real-time balance checking
- **History**: Track all past orders and their status
- **QR Code**: Generate QR codes for order verification

### Admin Portal
- **Dashboard**: Overview of revenue, orders, and system metrics
- **Students**: Manage student accounts and balances
- **Menu Management**: Add, edit, and remove menu items
- **Orders**: Review and approve/reject pending orders
- **Reports**: View analytics and revenue reports

## 🛠️ Tech Stack

- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Wouter** - Lightweight routing
- **React Query** - State management
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **React QR Code** - QR code generation

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components (Student/Admin)
│   │   └── ui/          # UI primitives (buttons, cards, etc.)
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and helpers
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin dashboard pages
│   │   └── student/     # Student portal pages
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # App entry point
│   └── index.css        # Global styles
└── index.html           # HTML template
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blue (#1E40AF) - Professional, trustworthy
- **Accent**: Amber (#FBBF24) - Attention, highlights
- **Success**: Green (#10B981) - Approved actions
- **Destructive**: Red (#DC2626) - Errors, rejections
- **Background**: Light Gray (#F9FAFB) - Clean, modern

### Typography
- **Font Family**: Inter (sans-serif), Merriweather (serif)
- **Headings**: Serif font for elegance
- **Body**: Sans-serif for readability

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:5000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript type checking

## 🎯 Demo Mode

The application runs with dummy data for demonstration purposes:

### Student Login
- Select any student from the dropdown
- Each student has a pre-loaded balance and order history

### Admin Login
- Click "Access Admin Panel"
- Full access to all management features

## 🔐 Features in Detail

### Student Features
- Real-time balance tracking
- Visual menu with categories
- Shopping cart functionality
- Order status notifications
- QR code generation for pickup
- Order history with filters

### Admin Features
- Student account management
- Balance top-up system
- Menu item CRUD operations
- Order approval workflow
- Revenue analytics
- Search and filter capabilities

## 🎨 UI/UX Highlights

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in effects and transitions
- **Professional Layout**: Clean, modern interface
- **Accessible**: Built with Radix UI primitives
- **Toast Notifications**: Real-time feedback
- **Loading States**: Skeleton screens and spinners

## 📱 Mobile Support

- Bottom navigation for students
- Hamburger menu for admin
- Touch-friendly buttons and inputs
- Optimized layouts for small screens

## 🔄 State Management

All data is managed through React Context (`DataContext`):
- Students array
- Menu items array
- Orders array
- Current user session

Data persists in memory during the session (resets on refresh).

## 🚀 Future Enhancements

- Backend API integration
- Real database persistence
- Payment gateway integration
- Email notifications
- Advanced reporting
- Multi-language support
- Dark mode toggle

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Development

This is a frontend-only application with no backend dependencies. All data is simulated using in-memory state management, making it perfect for:
- Prototyping
- UI/UX demonstrations
- Frontend development practice
- Design system showcases

---

Built with ❤️ for modern university campuses
