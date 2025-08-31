# Highway Delite - Full-Stack Note-Taking App

A production-ready note-taking application with email+OTP and Google OAuth authentication, built with React, TypeScript, Node.js, and MongoDB.

## 🚀 Features

- **Dual Authentication**: Email+OTP and Google OAuth
- **Secure OTP System**: Hashed OTPs with expiry and attempt limits
- **JWT Authentication**: Secure token-based authentication
- **Notes CRUD**: Create, read, and delete notes
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Real-time Feedback**: Toast notifications and loading states
- **Error Handling**: Comprehensive error handling and validation

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- TanStack Query for data fetching
- React Hot Toast for notifications
- Lucide React for icons

**Backend:**
- Node.js + TypeScript
- Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Zod for validation
- Google OAuth2 integration

**Database:**
- MongoDB (chosen for flexibility with document-based data and easy scaling)

### Project Structure

```
highway-delite/
├── src/                    # Frontend source
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and API client
│   ├── pages/             # Page components
│   └── App.tsx            # Main app component
├── server/                # Backend source
│   ├── config/            # Database configuration
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.ts           # Server entry point
└── README.md
```

## 🛠️ Local Setup

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Google OAuth credentials (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd highway-delite
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Configuration**

   Create `.env` file in the server directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   DATABASE_URL=mongodb://localhost:27017/highway-delite

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d

   # OTP Configuration
   OTP_EXP_MINUTES=10
   OTP_MAX_ATTEMPTS=5

   # Google OAuth (optional for development)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   OAUTH_REDIRECT_URL=http://localhost:5000/api/auth/google/callback

   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

   Create `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

6. **Run the application**

   **Option 1: Run both frontend and backend separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

   **Option 2: Run both together**
   ```bash
   npm run dev:full
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health check: http://localhost:5000/api/health

## 🔐 Authentication Flow

### Email + OTP Flow

1. **Sign Up:**
   - User enters email and name
   - System creates inactive user
   - Generates 6-digit OTP and sends via email
   - OTP is hashed and stored with expiry

2. **OTP Verification:**
   - User enters 6-digit OTP
   - System verifies OTP and activates user
   - Issues JWT token for authentication

3. **Login:**
   - User enters email
   - System sends new OTP
   - Same verification process as signup

### Google OAuth Flow

1. **OAuth Start:**
   - User clicks "Continue with Google"
   - Opens Google OAuth popup
   - Redirects to Google consent screen

2. **OAuth Callback:**
   - Google redirects with authorization code
   - Server exchanges code for user info
   - Creates/updates user and issues JWT
   - Closes popup and sends data to parent window

## 📡 API Endpoints

### Authentication
- `POST /auth/signup-email` - Create account with email
- `POST /auth/verify-otp` - Verify OTP and activate account
- `POST /auth/login-email` - Send OTP for login
- `POST /auth/google/start` - Start Google OAuth flow
- `GET /auth/google/callback` - Handle Google OAuth callback
- `POST /auth/logout` - Logout user

### User
- `GET /user/me` - Get current user info

### Notes
- `GET /notes` - Get user's notes
- `POST /notes` - Create new note
- `DELETE /notes/:id` - Delete note

## 🔒 Security Features

- **OTP Security:**
  - 6-digit numeric OTPs
  - bcrypt hashing with salt rounds
  - 10-minute expiry (configurable)
  - Maximum 5 attempts (configurable)
  - Automatic cleanup of expired OTPs

- **JWT Security:**
  - HTTP-only cookies (preferred)
  - Authorization headers (fallback)
  - Configurable expiry (7 days default)
  - Secure token verification

- **Input Validation:**
  - Zod schema validation
  - Email format validation
  - OTP length validation
  - Rate limiting on API endpoints

- **CORS Configuration:**
  - Origin-specific CORS
  - Credentials support
  - Secure cookie settings

## 🚀 Deployment

### Backend Deployment (Render/Railway/Fly.io)

1. **Build the application**
   ```bash
   cd server
   npm run build
   ```

2. **Set environment variables** in your deployment platform:
   - `DATABASE_URL` (MongoDB Atlas connection string)
   - `JWT_SECRET` (strong random string)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - `CORS_ORIGIN` (your frontend URL)
   - `OAUTH_REDIRECT_URL` (your backend URL + callback path)

3. **Deploy** using your preferred platform

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables:**
   - `VITE_API_BASE_URL` (your backend API URL)
   - `VITE_GOOGLE_CLIENT_ID` (your Google OAuth client ID)

3. **Deploy** using your preferred platform

### Database Setup

**MongoDB Atlas (Recommended):**
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Add IP whitelist or use 0.0.0.0/0 for all IPs
5. Update `DATABASE_URL` in environment variables

## 🧪 Testing

### Unit Tests
```bash
cd server
npm test
```

### Manual Testing Checklist

**Authentication:**
- [ ] Email signup flow
- [ ] OTP verification
- [ ] Email login flow
- [ ] Google OAuth flow
- [ ] Logout functionality

**Notes:**
- [ ] Create note
- [ ] List notes
- [ ] Delete note
- [ ] Authorization (users can only see their notes)

**Error Handling:**
- [ ] Invalid email format
- [ ] Wrong OTP
- [ ] Expired OTP
- [ ] Network errors
- [ ] Duplicate accounts

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Both:**
- `npm run dev:full` - Start both frontend and backend

### Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Zod**: Runtime type validation
- **Error Boundaries**: React error handling

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Tailwind CSS responsive utilities
- Touch-friendly interactions
- Optimized layouts for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Note:** This is a production-ready application with security best practices implemented. Make sure to change default secrets and configure proper environment variables before deployment.
