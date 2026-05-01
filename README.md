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
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Access at http://localhost:3000
```

### Manual Installation

```bash
# Install pnpm (if not installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Development
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Docker Commands

```bash
# Build image only
docker build -t sfd-tracker .

# Run container
docker run -d -p 3000:80 --name sfd-tracker sfd-tracker

# Stop and remove
docker stop sfd-tracker && docker rm sfd-tracker
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
