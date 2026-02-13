# 🚀 QUICK START GUIDE

## ⚡ Get Running in 3 Minutes

### Step 1️⃣: Install Dependencies
```bash
cd contactus-backend
npm install
```

### Step 2️⃣: Start MongoDB
**Option A - Local MongoDB:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or on Mac with Homebrew:
brew services start mongodb-community
```

**Option B - Use MongoDB Atlas (Cloud):**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` file with your connection string

### Step 3️⃣: Run the Server
```bash
npm run dev
```

You should see:
```
🚀 TechEduShop API Server Running
Environment: development
Port: 5000
URL: http://localhost:5000
```

---

## 🧪 Test the API

### Option 1: Use the Test Form
1. Open `test-form.html` in your browser
2. Fill out the form
3. Click "Send Message"

### Option 2: Use cURL
```bash
curl -X POST http://localhost:5000/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "school": "Test School",
    "email": "john@school.com",
    "phone": "+250 788 000 000",
    "message": "We are interested in your technology programs for our 500 students."
  }'
```

### Option 3: Import Postman Collection
1. Open Postman
2. Import `postman-collection.json`
3. Start testing all endpoints!

---

## 📧 Configure Email (Optional but Recommended)

### For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
3. Update `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ADMIN_EMAIL=admin@techedushop.com
   ```

---

## 🔌 Connect Your Frontend

Add this to your existing `index.html` before the closing `</body>` tag:

```html
<script src="frontend-integration.js"></script>
```

Or copy the code from `frontend-integration.js` directly into your HTML.

**Important:** Make sure to update the API_URL if your backend runs on a different port or domain.

---

## ✅ Verify Everything Works

1. **Health Check:**
   ```
   http://localhost:5000/health
   ```
   Should return: `{"status":"success","message":"Server is running"}`

2. **Submit a Test Contact:**
   Use test-form.html or the test cURL command above

3. **View All Contacts:**
   ```
   http://localhost:5000/api/v1/contacts
   ```

4. **Check Statistics:**
   ```
   http://localhost:5000/api/v1/contacts/stats
   ```

---

## 🐛 Troubleshooting

**Port 5000 already in use:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill

# Or change PORT in .env
PORT=3001
```

**MongoDB connection error:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start it if needed
sudo systemctl start mongod
```

**CORS errors from frontend:**
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Or add your domain to the CORS whitelist in `src/app.js`

---

## 📚 Next Steps

- Read the full `README.md` for detailed documentation
- Explore all endpoints in `postman-collection.json`
- Add authentication middleware for admin routes
- Deploy to production (Heroku, Railway, DigitalOcean, etc.)

---

## 🎯 Common Tasks

**View logs:**
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

**Stop the server:**
Press `Ctrl + C` in the terminal

**Restart the server:**
```bash
npm run dev
```

---

## 💡 Pro Tips

1. **Keep the dev server running** - It auto-reloads on code changes
2. **Check logs** if something doesn't work - they're very detailed
3. **Test with Postman** - Import the collection for easy API testing
4. **Email is optional** - The API works fine without email configuration

---

**Need help?** Check the README.md or contact: info@itc.rw
