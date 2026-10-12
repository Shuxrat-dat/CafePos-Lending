# CafePOS by YURTORA — Premium Landing Website

A cinematic, interactive landing website for CafePOS — a comprehensive restaurant automation system for cafés, restaurants, coffee shops, and fast-food establishments.

## 🎯 Overview

CafePOS is a digital management system that unifies front-of-house, kitchen, and business operations. This landing site showcases the product with premium animations, interactive demonstrations, and bilingual support (Russian/Uzbek).

## ✨ Key Features

- **Cinematic Hero Section** with 3D-like composition and parallax effects
- **Interactive Restaurant Demo** showing complete order flow from table to kitchen
- **Animated UI Mockups** demonstrating real POS functionality
- **QR Menu Demonstration** with mobile ordering interface
- **Kitchen Display System** with real-time order status updates
- **Venue Showcases** for different establishment types
- **Analytics Dashboard** with animated charts
- **Bilingual Support** (RU/UZ) with complete localization
- **Premium Animations** using Motion library
- **Fully Responsive** design for all device sizes

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Motion 14
- **Icons**: Lucide React
- **Runtime**: React 19

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:3102`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
cafepos-landing/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── sections/     # Page sections
│   │   ├── ui/           # Reusable UI components
│   │   └── icons/        # SVG icons and logo
│   ├── data/             # Demo data and content
│   ├── i18n/             # Translations (RU/UZ)
│   ├── config/           # Configuration files
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── package.json
```

## 🌐 Localization

The site supports Russian and Uzbek languages with complete translation coverage:
- UI elements
- Navigation
- Content sections
- Demo interfaces
- Form validation messages
- Error messages

## 🎨 Design System

The site follows a premium hospitality technology aesthetic with:
- Deep graphite and black backgrounds
- Warm amber and gold accents
- Premium typography
- Architectural geometric elements
- Cinematic lighting and shadows

## 🔗 Related Products

CafePOS is part of the YURTORA ecosystem:
- **YURTORA** — Main company website
- **StoreGo POS** — Retail automation system

## ⚠️ Important Notes

- This is a standalone marketing website, separate from the CafePOS application
- All demos and statistics are for demonstration purposes only
- The interactive restaurant demo runs client-side only
- No real payment processing or order management is connected
- Form submissions require backend API configuration

## 📝 Configuration

Environment variables (`.env.local`):

```env
NEXT_PUBLIC_YURTORA_URL=https://yurtora.uz
```

## 🎭 Demo Features

The interactive restaurant demonstration includes:
- Floor plan with table management
- Waiter/cashier interface for order creation
- Menu browsing and selection
- Kitchen Display System (KDS)
- Order status progression
- Automated demo flow

All interactions are local and demonstrate the concept without backend connectivity.

## 🧪 Testing

Before deployment, verify:
- [ ] Interactive demo works end-to-end
- [ ] Language switcher changes all content
- [ ] Forms validate correctly
- [ ] Animations run smoothly
- [ ] Mobile responsiveness on various devices
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Build completes without errors

## 📄 License

Private - YURTORA

## 👥 Credits

Created for YURTORA as a premium showcase of the CafePOS restaurant automation system.
