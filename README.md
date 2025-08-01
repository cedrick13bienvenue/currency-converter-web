# Currency Converter

A full-stack currency converter application that provides real-time exchange rates and currency conversion functionality using ExchangeRate-API.

## Project Structure

```
currency-converter/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── package.json       # Backend dependencies and scripts
│   ├── .env              # Environment variables (API keys, etc.)
│   └── Dockerfile        # Docker configuration (optional)
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── script.js         # Frontend JavaScript logic
│   ├── style.css         # Styling and responsive design
│   └── vercel.json       # Vercel deployment configuration
└── README.md             # Project documentation
```

## Features

- 🌍 Real-time currency exchange rates from ExchangeRate-API
- 💱 Convert between 100+ currencies
- 📱 Responsive design for mobile and desktop
- ⚡ Auto-convert with debounced input
- 🔄 Currency swap functionality
- 📡 Offline/online status detection

## Tech Stack

### Backend

- **Node.js & Express.js** - Server and API
- **Axios** - HTTP requests to ExchangeRate-API
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend

- **HTML5/CSS3/JavaScript** - Pure vanilla frontend
- **Responsive Design** - Mobile-first approach

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- ExchangeRate-API key (get free key at https://exchangerate-api.com/)

### Installation

1. **Clone and setup backend**

   ```bash
   git clone <repository-url>
   cd currency-converter/backend
   npm install
   ```

2. **Environment Configuration**
   Create `.env` file in backend directory:

   ```env
   PORT=3000
   EXCHANGE_API_KEY=your_exchangerate_api_key_here
   NODE_ENV=development
   ```

3. **Start the server**

   ```bash
   npm start
   # or for development
   npm run dev
   ```

4. **Open frontend**
   Open `frontend/index.html` in browser or serve with local server

## API Endpoints

- `GET /api/currencies` - Get supported currencies list
- `POST /api/convert` - Convert currency amounts
  ```json
  {
    "amount": 100,
    "from": "USD",
    "to": "EUR"
  }
  ```

## Deployment

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables:
   - `EXCHANGE_API_KEY`: Your ExchangeRate-API key
   - `NODE_ENV`: production
3. Deploy with build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel)

1. Update API_BASE_URL in `script.js` to your Render backend URL
2. Deploy to Vercel:
   ```bash
   cd frontend
   vercel
   ```

## Environment Variables

```env
PORT=3000
EXCHANGE_API_KEY=your_exchangerate_api_key_here
NODE_ENV=production
```

## Package.json Dependencies

```json
{
  "dependencies": {
    "axios": "^1.7.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## License

MIT License

---

**Built with ❤️ using ExchangeRate-API and Express.js**
