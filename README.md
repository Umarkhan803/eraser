# eraser

Author Mohammed Umar Khan 

# Eraser.io Clone - Collaborative Diagramming Tool

A full-stack collaborative diagramming and whiteboard application similar to Eraser.io, built with React, TypeScript, Node.js, Express, and MongoDB.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can edit canvas simultaneously using WebSockets
- **Canvas Drawing Tools**: Draw shapes, lines, text, and connectors
- **Project Management**: Create, save, and organize multiple projects
- **Authentication & Authorization**: Secure user registration and login with JWT
- **Version Control**: Undo/redo functionality for canvas operations
- **Export Options**: Export diagrams as PNG, SVG, or PDF
- **Comments & Annotations**: Collaborative feedback system
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## 🛠️ Tech Stack

### Frontend

- **React 18** with **TypeScript**
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Fabric.js** - Canvas manipulation and drawing
- **Socket.io Client** - Real-time WebSocket communication
- **Zustand** - State management
- **TanStack Query (React Query)** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Formik + Yup** - Form handling and validation
- **React Toastify** - Toast notifications

### Backend

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** - Database and ODM
- **Socket.io** - WebSocket server for real-time features
- **JWT (jsonwebtoken)** - Authentication
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Morgan** - HTTP request logging
- **Winston** - Application logging
- **Multer** - File upload handling

## 📁 Project Structure

```
eraser/
├── frontend/                 # React TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Buttons, Modals, Loaders
│   │   │   ├── canvas/      # Canvas, Toolbar, Drawing tools
│   │   │   ├── sidebar/     # Layers, Properties panels
│   │   │   └── collaboration/ # Collaborators, Comments
│   │   ├── pages/           # Main application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API and WebSocket services
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── config/         # Database, WebSocket configuration
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── websocket/      # WebSocket event handlers
│   │   └── server.js       # Application entry point
│   ├── uploads/            # File upload directory
│   ├── logs/               # Application logs
│   ├── .env                # Environment variables
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/eraser-clone.git
cd eraser-clone
```

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install additional dependencies
npm install react-router-dom axios socket.io-client zustand @tanstack/react-query fabric react-toastify uuid formik yup

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind (if not already configured)
npx tailwindcss init -p

# Install TypeScript types
npm install -D @types/uuid @types/fabric

# Install dev tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

**Configure Tailwind CSS:**

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Add Tailwind directives to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 3. Backend Setup

```bash
# Navigate to backend directory
cd ../backend

# Initialize npm (if not already done)
npm init -y

# Install core dependencies
npm install express mongoose socket.io cors dotenv helmet morgan express-rate-limit

# Install authentication packages
npm install bcryptjs jsonwebtoken cookie-parser

# Install validation
npm install express-validator joi

# Install utilities
npm install multer winston uuid

# Install development dependencies
npm install -D nodemon concurrently
```

**Configure Environment Variables:**

Create `.env` file in backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eraser-clone
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eraser-clone

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### 4. MongoDB Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB locally
# Follow instructions at: https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### Running the Application

#### Start Backend Server

```bash
# From backend directory
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

#### Run Both Simultaneously (Optional)

Create `package.json` in root directory:

```json
{
  "name": "eraser-clone",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"cd frontend && npm run dev\" \"cd backend && npm run dev\"",
    "install-all": "cd frontend && npm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Install concurrently:

```bash
npm install
```

Run both:

```bash
npm run dev
```

## 📝 Available Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend

```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Canvas

- `GET /api/canvas/:id` - Get canvas data
- `PUT /api/canvas/:id` - Update canvas
- `POST /api/canvas/:id/export` - Export canvas

### Collaboration

- `POST /api/projects/:id/invite` - Invite collaborator
- `GET /api/projects/:id/collaborators` - Get all collaborators
- `DELETE /api/projects/:id/collaborators/:userId` - Remove collaborator

## 🔌 WebSocket Events

### Client → Server

- `join-canvas` - Join a canvas room
- `canvas-update` - Send canvas updates
- `cursor-move` - Send cursor position
- `add-comment` - Add comment to canvas

### Server → Client

- `canvas-update` - Receive canvas updates from other users
- `user-joined` - New user joined the canvas
- `user-left` - User left the canvas
- `cursor-update` - Receive cursor positions

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Render/Railway/Heroku)

```bash
cd backend
# Set environment variables on your hosting platform
# Deploy using platform-specific instructions
```

### Environment Variables for Production

Make sure to set these in your hosting platform:

- `NODE_ENV=production`
- `MONGODB_URI` (your production database)
- `JWT_SECRET` (strong secret key)
- `CLIENT_URL` (your frontend URL)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Mohammed Umar Khan**

- GitHub: [https://github.com/Umarkhan803]
- Email: mohammedumarkhan803@gmail.com

## 🙏 Acknowledgments

- Inspired by [Eraser.io](https://eraser.io)
- Built with modern web technologies
- Thanks to all open-source contributors

## 📞 Support

For support, email mohammedumarkhan803@gmail.com or open an issue in the repository.

---

**Happy Coding! 🎨✨**
