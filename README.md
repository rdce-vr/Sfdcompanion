# SFD Delivery Earnings Tracker

A Progressive Web App (PWA) for tracking Shopee Food Driver delivery earnings, tips, and fuel expenses.

## Features

- 📱 **Mobile-First Design** - Optimized for on-the-go use
- 🌙 **Dark Mode** - Eye-friendly dark theme with Shopee orange accent
- 💰 **Multi-Entry Tracking** - Add multiple deliveries per session
- 💸 **Tip Management** - Track cash and SPay tips separately
- ⛽ **Fuel Expense Calculator** - Calculate fuel costs with km/L tracking
- 💾 **Offline Support** - Works offline with localStorage persistence
- 🔄 **PWA Ready** - Install on your device for app-like experience

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# Access the app at http://localhost:3000
```

### Manual Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

## How to Use

### Adding a Delivery

1. Click **"Add New Delivery"** on the home screen
2. Enter SPay Income (digital wallet payment)
3. Toggle **Cash Payment** if customer paid delivery fee in cash
   - Enter amount owed and paid
   - Tip is auto-calculated if paid > owed
4. Click circular **+** to add separate tips (Cash or SPay)
5. Save entry

### Tracking Fuel

1. Go to **"View All Entries"**
2. Enter fuel cost per litre, distance traveled, and km/L
3. Summary automatically calculates fuel expenses

### Viewing Summary

Home page shows:
- SPay Income total
- Total Tips (Cash + SPay breakdown)
- Total Income
- Fuel Expense
- Net Earnings
- **Amount to Transfer** (cash owed from customers)

## Tech Stack

- React 18
- TypeScript
- React Router
- Tailwind CSS v4
- Lucide Icons
- Vite
- Docker & Nginx

## License

MIT
