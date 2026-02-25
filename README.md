# Farmer2Home Connect

A fixed-price digital marketplace connecting farmers directly with consumers.

## Project Structure
- `server/`: Node.js + Express Backend
- `client/`: Vanilla JS Frontend

## Prerequisites
- Node.js installed
- MongoDB Atlas URI (configured in `server/.env`)

## Setup & Run

### 1. Backend
```bash
cd server
npm install
# Create .env file with PORT and MONGO_URI if not exists
npm run dev
```

### 2. Frontend
You can serve the `client` folder using any static server.
Example using `serve`:
```bash
npx serve client
```
Or simply open `client/index.html` in your browser (might need a local server for ES modules to work correctly due to CORS policies on file:// protocol).
**Recommended**: Use VS Code "Live Server" extension on the `client` folder.

## Features implemented
- **User Roles**: Farmer, Customer, Admin
- **Authentication**: JWT based
- **Crop Management**: Add, View, Delete, Auto-expiry
- **Marketplace**: Browse active crops
- **Orders**: Place orders (Fixed price)
- **Reviews**: Verified purchase reviews
- **Admin**: Monitor system

## Academic Compliance
- No price negotiation
- Expiry logic automation
- 3-Tier Architecture
