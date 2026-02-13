# TechEduShop Contact API

Professional-grade Node.js/Express/MongoDB backend for managing contact form submissions with email notifications, validation, and admin management features.

## 🚀 Features

- ✅ **RESTful API** with Express.js
- ✅ **MongoDB** with Mongoose ODM
- ✅ **Input Validation** using express-validator
- ✅ **Email Notifications** with Nodemailer (admin notifications + auto-replies)
- ✅ **Security Best Practices**:
  - Helmet.js for HTTP headers
  - Rate limiting
  - CORS configuration
  - NoSQL injection protection
  - Input sanitization
- ✅ **Professional Logging** with Winston
- ✅ **Error Handling** with custom error classes
- ✅ **Request Compression**
- ✅ **Environment-based Configuration**
- ✅ **Clean Architecture** with MVC pattern
- ✅ **Pagination, Filtering & Search**
- ✅ **Contact Management** (statuses, priorities, archiving)

## 📁 Project Structure

```
contactus-backend/
├── src/
│   ├── config/
│   │   ├── config.js           # Environment configuration
│   │   └── database.js         # MongoDB connection
│   ├── controllers/
│   │   └── contactController.js # Business logic
│   ├── models/
│   │   └── Contact.js          # Mongoose schema
│   ├── routes/
│   │   └── contactRoutes.js    # API routes
│   ├── middleware/
│   │   ├── errorHandler.js     # Error handling
│   │   └── validateRequest.js  # Validation middleware
│   ├── validators/
│   │   └── contactValidator.js # Input validation rules
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   └── emailService.js     # Email service
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
├── logs/                       # Log files (auto-generated)
├── .env                        # Environment variables
├── .env.example               # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or MongoDB Atlas)

### Step 1: Install Dependencies

```bash
cd contactus-backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000

# MongoDB - Local
MONGODB_URI=mongodb://localhost:27017/techedushop

# MongoDB - Production (MongoDB Atlas)
# MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/techedushop

# CORS
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@techedushop.com
ADMIN_EMAIL=admin@techedushop.com
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud) and update `MONGODB_URI_PROD` in `.env`

### Step 4: Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on `http://localhost:5000`

## 📡 API Endpoints

### Public Endpoints

#### Create Contact Submission
```http
POST /api/v1/contacts
Content-Type: application/json

{
  "name": "John Smith",
  "school": "St. Mary's School",
  "email": "john@school.com",
  "phone": "+250 788 000 000",
  "message": "We have 500 students in grades 1-6..."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Thank you for contacting us! We will get back to you soon.",
  "data": {
    "contact": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "school": "St. Mary's School",
      "email": "john@school.com",
      "createdAt": "2026-02-06T10:30:00.000Z"
    }
  }
}
```

### Admin Endpoints

#### Get All Contacts (with filtering & pagination)
```http
GET /api/v1/contacts?page=1&limit=10&status=new&search=school
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status: `new`, `contacted`, `in-progress`, `completed`, `closed`
- `priority` - Filter by priority: `low`, `medium`, `high`
- `isRead` - Filter by read status: `true`, `false`
- `search` - Search in name, school, email, message
- `sortBy` - Sort field (default: `-createdAt`)

#### Get Single Contact
```http
GET /api/v1/contacts/:id
```

#### Update Contact
```http
PATCH /api/v1/contacts/:id
Content-Type: application/json

{
  "status": "contacted",
  "priority": "high",
  "notes": "Follow up next week",
  "isRead": true
}
```

#### Delete Contact
```http
DELETE /api/v1/contacts/:id
```

#### Mark as Read
```http
PATCH /api/v1/contacts/:id/read
```

#### Archive Contact
```http
PATCH /api/v1/contacts/:id/archive
```

#### Get Statistics
```http
GET /api/v1/contacts/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 156,
    "unread": 23,
    "byStatus": {
      "new": 45,
      "contacted": 32,
      "in-progress": 28,
      "completed": 40,
      "closed": 11
    },
    "recentContacts": 12
  }
}
```

### Health Check
```http
GET /health
```

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification
   - App Passwords → Generate
3. Use the generated password in `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### Email Features

- **Admin Notification**: Sent to `ADMIN_EMAIL` when a new contact is submitted
- **Auto-Reply**: Sent to the contact person confirming receipt
- **HTML Templates**: Professional, branded email templates
- **Non-blocking**: Emails are sent asynchronously without blocking responses

## 🔒 Security Features

1. **Helmet.js**: Secure HTTP headers
2. **Rate Limiting**: 100 requests per 15 minutes per IP
3. **CORS**: Configurable cross-origin requests
4. **Input Validation**: Strong validation with express-validator
5. **NoSQL Injection Protection**: MongoDB query sanitization
6. **XSS Protection**: HTML tag stripping from user inputs
7. **Data Size Limits**: Request body limited to 10kb

## 📊 Database Schema

```javascript
Contact {
  name: String (required, 2-100 chars)
  school: String (required, 2-200 chars)
  email: String (required, valid email)
  phone: String (optional, valid phone format)
  message: String (required, 10-2000 chars)
  status: Enum (new, contacted, in-progress, completed, closed)
  priority: Enum (low, medium, high)
  source: Enum (website, phone, email, referral, other)
  notes: String (admin notes)
  ipAddress: String (auto-captured)
  userAgent: String (auto-captured)
  isRead: Boolean (default: false)
  isArchived: Boolean (default: false)
  timestamps: createdAt, updatedAt
}
```

## 🧪 Testing

Test the API using tools like:
- Postman
- Thunder Client (VS Code)
- cURL
- Your frontend application

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "school": "Test School",
    "email": "test@school.com",
    "phone": "+250 788 000 000",
    "message": "This is a test message"
  }'
```

## 📝 Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Console logging is enabled in development mode.

## 🚀 Production Deployment

### Environment Setup

1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas or production MongoDB instance
3. Configure production CORS origins
4. Set up proper email credentials
5. Use process manager (PM2):

```bash
npm install -g pm2
pm2 start src/server.js --name techedushop-api
pm2 save
pm2 startup
```

### Recommended Services

- **Hosting**: AWS EC2, DigitalOcean, Heroku, Railway
- **Database**: MongoDB Atlas (cloud)
- **Email**: SendGrid, AWS SES, Gmail
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Verify firewall rules for MongoDB port (27017)

### Email Not Sending
- Verify email credentials
- Check Gmail app password (not regular password)
- Review email service logs in `logs/error.log`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:5000 | xargs kill`

## 📄 License

ISC

## 👨‍💻 Author

TechEduShop Development Team

## 🤝 Support

For issues or questions:
- Email: info@itc.rw
- Phone: +250 788 829 942
