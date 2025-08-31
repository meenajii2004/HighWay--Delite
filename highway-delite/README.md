# 🚀 Highway Delite - Full-Stack Note-Taking Application

A modern, production-ready note-taking application with email+OTP authentication and Google OAuth2 integration.

## ✨ Features

### 🔐 Authentication
- **Email + OTP Verification**: Secure signup/login with email verification
- **Google OAuth2**: One-click authentication with Google accounts
- **JWT Tokens**: Secure session management with HTTP-only cookies
- **Passwordless**: No passwords to remember or manage

### 📝 Notes Management
- **CRUD Operations**: Create, read, update, and delete notes
- **Real-time Updates**: Instant UI updates with TanStack Query
- **User-specific**: Each user sees only their own notes
- **Rich Text Support**: Full text editing capabilities

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Mobile Responsive**: Works perfectly on all devices
- **Loading States**: Smooth loading animations and skeleton screens
- **Toast Notifications**: User-friendly feedback messages
- **Date of Birth**: Optional user profile information

### 🛡️ Security
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Zod schema validation for all requests
- **CORS Configuration**: Proper cross-origin resource sharing
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe development
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Google OAuth2** - Social authentication
- **Nodemailer** - Email sending (stubbed for dev)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **tsx** - TypeScript execution

## 📁 Project Structure

```
highway-delite/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   └── assets/            # Static assets
├── server/                # Backend source code
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── package.json
├── public/                # Public assets
└── package.json           # Frontend dependencies
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/meenajii2004/HighWay--Delite
cd highway-delite
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Environment Setup

#### Frontend Environment (.env)
Create `highway-delite/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend Environment (.env)
Create `highway-delite/server/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb_url
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_REDIRECT_URL=http://localhost:5000/api/auth/google/callback

# CORS
CORS_ORIGIN=http://localhost:5173

# OTP Configuration
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# Email (stubbed for development)
EMAIL_FROM=noreply@highwaydelite.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Start the Application

#### Option A: Start Both Servers (Recommended)
```bash
npm run dev:full
```

#### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔧 Development

### Available Scripts

#### Frontend Scripts
```bash
npm run dev          # Start frontend dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend Scripts
```bash
cd server
npm run dev          # Start backend dev server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
```

#### Full Stack Scripts
```bash
npm run dev:full     # Start both frontend and backend
npm run build:full   # Build both frontend and backend
```

### Database Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `highway-delite`

#### MongoDB Atlas (Cloud)
1. Create MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Update environment variables with client ID and secret

## 📱 Usage

### Authentication Flow

#### Email + OTP Signup
1. Navigate to `/signup`
2. Enter name, email, and optional date of birth
3. Click "Get OTP"
4. Check email for 6-digit code
5. Enter OTP and verify
6. Account created successfully!

#### Email + OTP Login
1. Navigate to `/login`
2. Enter email address
3. Click "Get OTP"
4. Check email for 6-digit code
5. Enter OTP and sign in
6. Welcome to your dashboard!

#### Google OAuth
1. Click "Google" button on signup/login page
2. Authorize with Google account
3. Automatically signed in!

### Notes Management

#### Create Note
1. Click "Create Note" button
2. Enter title and content
3. Click "Create" to save

#### Edit Note
1. Click edit icon on any note
2. Modify title or content
3. Click "Save Changes"

#### Delete Note
1. Click delete icon on any note
2. Confirm deletion

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
npm run build
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Backend Deployment (Render/Railway/Fly.io)

#### Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Database Deployment (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in production environment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_REDIRECT_URL=https://your-backend-domain.com/api/auth/google/callback
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm run test
```

### Frontend Tests
```bash
npm run test
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: XSS protection
- **Rate Limiting**: Brute force protection
- **Input Validation**: Zod schema validation
- **CORS Configuration**: Proper cross-origin handling
- **Error Handling**: No sensitive data exposure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is running
4. Check network connectivity
5. Review the logs for detailed error information

## 🎯 Roadmap

- [ ] Real-time collaboration
- [ ] Rich text editor
- [ ] File attachments
- [ ] Note sharing
- [ ] Mobile app
- [ ] Dark mode
- [ ] Note categories/tags
- [ ] Search functionality
- [ ] Export/import notes 

---

**Built with ❤️ using modern web technologies**
contact :- meenaharsh909@gmail.com


