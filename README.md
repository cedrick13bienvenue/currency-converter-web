# Currency Converter Web App

A simple, responsive web-based currency converter with real-time exchange rates. Built with vanilla HTML, CSS, JavaScript, and Node.js Express backend.

## 🚀 Features

- **Real-time Exchange Rates** - Live data from ExchangeRate-API
- **Clean, Modern UI** - Responsive design with gradient styling
- **Interactive Features** - Currency swap, auto-conversion, search
- **Error Handling** - Comprehensive validation and error messages
- **Mobile Responsive** - Works perfectly on all devices
- **Docker Ready** - Containerized for easy deployment
- **Render Compatible** - Optimized for Render deployment

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **API**: ExchangeRate-API
- **Deployment**: Docker, Render

## 📋 Prerequisites

- Node.js 14.0.0 or higher
- ExchangeRate-API key (free at [exchangerate-api.com](https://app.exchangerate-api.com/sign-up))

## 🏃‍♂️ Quick Start

### Local Development

1. **Clone and setup:**

```bash
git clone <your-repo-url>
cd currency-converter-web
npm install
```

2. **Configure environment:**

```bash
cp .env.example .env
# Edit .env and add your API key:
# EXCHANGE_API_KEY=your_actual_api_key_here
```

3. **Run the application:**

```bash
npm start
# Or for development with auto-restart:
npm run dev
```
