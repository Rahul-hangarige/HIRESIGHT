# HireSight - AI-Powered Resume Analysis Platform

A modern, professional resume analysis platform built with React, Express, and MongoDB Atlas. Powered by AI for intelligent candidate screening.

## ✨ Features

- **Resume Upload & Analysis** - Upload resumes in PDF, DOC, DOCX, or TXT format
- **AI-Powered Insights** - Get comprehensive analysis with skill matching, experience levels, and recommendations
- **Candidate Management** - Track and manage all candidate submissions
- **Professional Dashboard** - Beautiful, modern UI with professional CSS (Google-inspired design)
- **Dark Mode Support** - Full dark mode implementation for comfortable viewing
- **Secure Authentication** - JWT-based user authentication with password hashing
- **MongoDB Atlas Integration** - Cloud-based database for scalability

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ installed
- MongoDB Atlas account (free tier available)
- npm or yarn

### 1️⃣ Setup Backend

```bash
cd server
npm install
```

Configure environment variables in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hiresight?retryWrites=true&w=majority
JWT_SECRET=your_secure_secret_key_here
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=  # Optional: Add your OpenAI key for real AI analysis
```

Start the server:
```bash
npm run dev
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
HireSight Server running in development mode on port 5000
```

### 2️⃣ Setup Frontend

Open a **new terminal**:

```bash
cd client
npm install
```

Start the client:
```bash
npm run dev
```

You should see:
```
VITE v8.1.0  ready in 234 ms
➜  Local:   http://localhost:5173/
```

### 3️⃣ Access the App

Open your browser and go to:
```
http://localhost:5173
```

## 📋 How to Use

### Register/Login
1. Create a new account or login with existing credentials
2. Enter your name, email, password, and organization

### Resume Analysis
1. Click **"Resume Analyzer"** in the sidebar
2. Enter candidate information (name, email, phone, title, LinkedIn)
3. Upload resume (drag & drop or click to browse)
4. Click **"Analyze Resume"**
5. View comprehensive AI-powered insights:
   - Overall Score
   - Experience Level
   - Skill Match
   - Recommendation
   - Strengths & Opportunities
   - Top Skills
   - Executive Summary

### Manage Candidates
- View all uploaded candidates
- See analysis results
- Track candidate progress

### Profile
- Update personal information
- Change password
- View organization details

## 🎨 Design Features

The dashboard uses a **professional, Google-inspired design** with:
- Clean typography with Inter and Sora fonts
- Smooth animations and transitions
- Glass-morphism effects
- Responsive gradient backgrounds
- Professional card layouts
- Modern input fields with focus states
- Accessibility features (reduced motion support)

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Secure file uploads with validation

## 📁 Project Structure

```
HIRESIGHT/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth & Theme context
│   │   ├── App.jsx
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── services/           # Business logic
│   ├── app.js              # Express setup
│   ├── server.js           # Entry point
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Candidates
- `GET /api/candidates` - List all candidates
- `POST /api/candidates` - Create new candidate (with resume upload)
- `GET /api/candidates/:id` - Get candidate details
- `DELETE /api/candidates/:id` - Delete candidate

### Analysis
- `POST /api/analyses` - Generate analysis
- `GET /api/analyses/candidate/:candidateId` - Get analysis results

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot connect to MongoDB` | Check MONGODB_URI in .env and ensure IP is whitelisted in Atlas |
| `Port 5000 already in use` | Change PORT in server/.env or kill the process using that port |
| `Frontend won't load` | Ensure backend is running on http://localhost:5000 |
| `CORS errors` | Check CORS_ORIGIN matches frontend URL (http://localhost:5173) |
| `npm install fails` | Delete node_modules and package-lock.json, then try again |

## 📚 Technologies Used

### Frontend
- React 19
- React Router v6
- Axios for HTTP requests
- Tailwind CSS for styling
- Vite for bundling
- Lucide React for icons
- Recharts for data visualization

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- OpenAI API (optional)

## 🔮 Future Features

- [ ] Real-time notifications
- [ ] Export analysis as PDF
- [ ] Bulk resume processing
- [ ] Advanced filtering & search
- [ ] Resume template suggestions
- [ ] Video interview integration
- [ ] Team collaboration features

## 📝 Environment Variables

**Server (.env)**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=<your_atlas_url>
JWT_SECRET=<your_secret>
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=<optional>
```

**Client**
No special configuration needed. API routes are proxied through Vite.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For issues or questions, please check the troubleshooting section or review backend logs.

---

Built with ❤️ for modern recruitment
