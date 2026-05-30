# Helpers - Hyper-Local Delivery Application

A full-stack real-time delivery tracking system with three main interfaces: **User**, **Delivery Partner**, and **Admin**. Built with React, Node.js, Express, MongoDB, and Socket.io for real-time updates.

## 🎯 Key Features

### User Side
- 📝 **Simple Registration**: Name + Mobile Number (No OTP, local storage-based session)
- 📋 **Text-Based Ordering**: Clean interface to submit shopping lists/requirements
- 🗺️ **Real-Time Order Tracking**: Live status updates (Order Placed → Accepted → Out for Delivery → Delivered)
- 📍 **Live Map Integration**: Leaflet.js + OpenStreetMap to track Delivery Partner's location
- 📱 **Direct Contact**: Call button revealing Delivery Partner's mobile number once order is assigned

### Delivery Partner Side
- ✅ **Onboarding**: Registration with document upload for Admin approval
- 📊 **Order Dashboard**: View incoming orders and accept deliveries
- 📍 **Live GPS Streaming**: Real-time location updates via browser's Geolocation API
- 📞 **User Contact**: Access User's mobile number and delivery location on map

### Admin Portal
- 🔐 **Secure Login**: Username/Password via Environment Variables
- ✔️ **Approval System**: Review and approve/reject Delivery Partner documents
- 👁️ **Master Dashboard**: Monitor all active orders, live maps, and contact details in real-time

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + Next.js + Tailwind CSS + Leaflet.js |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB |
| **Real-time** | Socket.io |
| **Maps** | Leaflet.js + OpenStreetMap (OSM) |
| **State Management** | Redux Toolkit / Context API |

## 📁 Project Structure

```
Helpers-/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   ├── utils/
│   ├── .env.local.example
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── socket/
│   ├── .env.example
│   └── package.json
├── README.md
├── docker-compose.yml (optional)
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

#### 1. Clone and Setup
```bash
git clone https://github.com/954640/Helpers-.git
cd Helpers-
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Configure .env with your credentials
nano .env

# Start backend
npm run dev
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env.local file
cp .env.local.example .env.local

# Start frontend
npm run dev
```

Visit:
- **User App**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:5000

## 🔐 Environment Variables

### Backend (.env)
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/helpers

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password_123

# Server
PORT=5000
NODE_ENV=development

# Socket.io
SOCKET_CORS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📊 Database Schema

### Collections
- **Users**: Name, mobile, address, active orders
- **Orders**: User ID, delivery partner ID, items, status, timestamps
- **DeliveryPartners**: Name, mobile, location, documents, approval status
- **DeliveryLocations**: Real-time GPS coordinates from delivery partners

## 🔄 Real-Time Features

### Socket.io Events
- `order:created` - New order placed
- `order:accepted` - Delivery partner accepts order
- `order:location_update` - Live GPS update
- `order:status_change` - Order status changes
- `contact:revealed` - Contact numbers shared

## 🗺️ Map Integration

All maps use **Leaflet.js** with **OpenStreetMap** tiles (free, no API key required):
- User tracking screen: Shows delivery partner's live location
- Delivery partner dashboard: Shows user's delivery location
- Admin master view: Shows all active deliveries on map

## 🔒 Security Features

✅ **Contact Privacy**: Numbers hidden until order is assigned  
✅ **Admin Credentials**: Managed via environment variables (no hardcoding)  
✅ **Session Management**: Local storage-based for users (no OTP complexity)  
✅ **Document Verification**: Admin approval system for delivery partners  
✅ **Real-time GPS**: Only streamed during active delivery  

## 📱 Mobile Responsiveness

All interfaces are fully responsive:
- Desktop, tablet, and mobile breakpoints
- Touch-friendly buttons and navigation
- Map interactions optimized for mobile devices

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 📖 API Documentation

See `backend/API.md` for complete endpoint documentation.

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for commercial purposes.

## 💡 Future Enhancements

- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Rating & review system
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multiple delivery partner assignments
- [ ] Scheduled orders
- [ ] Customer support chat

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for hyper-local commerce**
