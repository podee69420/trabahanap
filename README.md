# 🏢 Trabahanap - Job Posting Platform

A simple, beginner-friendly job posting website for job seekers in Baliwag, Bulacan to connect with employers.

## ✨ Features

- ✅ Post your job seeker profile (CRUD functionality)
- ✅ View all job seeker profiles in a bulletin board
- ✅ Search and filter by name, skills, barangay
- ✅ Only allow residents of Baliwag, Bulacan to post
- ✅ Mobile-responsive design
- ✅ Green, blue, and white color scheme
- ✅ Easy SQLite database (no complex setup)
- ✅ Free deployment on Render

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- Git - [Download](https://git-scm.com/)
- Visual Studio Code - [Download](https://code.visualstudio.com/)

### Local Setup (5 minutes)

1. **Clone or create the project folder:**
   ```bash
   mkdir trabahanap
   cd trabahanap
   ```

2. **Initialize Git and Node:**
   ```bash
   git init
   npm init -y
   ```

3. **Install dependencies:**
   ```bash
   npm install express sqlite3 body-parser cors
   ```

4. **Create the project structure:**
   ```
   trabahanap/
   ├── server.js
   ├── package.json
   ├── trabahanap.db (auto-created)
   ├── public/
   │   ├── index.html
   │   ├── style.css
   │   └── script.js
   └── .gitignore
   ```

5. **Create files** (see full file list above)

6. **Start the server:**
   ```bash
   node server.js
   ```

7. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📁 File Structure Explained

| File | Purpose |
|------|---------|
| `server.js` | Backend API (Node.js + Express) |
| `public/index.html` | Main website page |
| `public/style.css` | Styling (green, blue, white theme) |
| `public/script.js` | Website functionality (JavaScript) |
| `trabahanap.db` | Database (auto-created SQLite) |
| `package.json` | Project dependencies |

## 🔄 How CRUD Works

### **CREATE** - Post a Profile
1. Click "📝 Post Profile" button
2. Fill in your details
3. Click "✅ Submit Profile"
4. Your profile appears in "My Posted Profiles" and the bulletin board

### **READ** - View Profiles
1. Click "👥 View Jobs" to see all job seeker profiles
2. Use search bar to find specific people
3. Filter by barangay

### **UPDATE** - Edit Your Profile
1. Go to "📝 Post Profile" section
2. Click "Edit" button on your profile
3. Modify your information
4. Click "✅ Submit Profile" to save changes

### **DELETE** - Remove Your Profile
1. Go to "📝 Post Profile" section
2. Click "Delete" button on your profile
3. Confirm deletion

## 📊 Database Schema

The SQLite database has one main table: `job_seekers`

```sql
CREATE TABLE job_seekers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  barangay TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  experience TEXT,
  skills TEXT,
  facebook_link TEXT,
  position_desired TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🎨 Customization

### Change Colors
Edit `public/style.css` and modify:
```css
:root {
    --primary-color: #0066cc;      /* Blue */
    --success-color: #27ae60;       /* Green */
    --white: #ffffff;               /* White */
}
```

### Add More Fields
1. Add column to database in `server.js` (modify CREATE TABLE)
2. Add form field in `public/index.html`
3. Update form handling in `public/script.js`

### Change Baranggays List
Edit the `baliwagBaranggays` array in `server.js`

## 🌐 Deploy to Render (FREE)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit: Trabahanap job posting site"
git remote add origin https://github.com/YOUR_USERNAME/trabahanap.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `trabahanap` repository
5. Fill in:
   - **Name**: trabahanap
   - **Environment**: Node
   - **Build command**: `npm install`
   - **Start command**: `node server.js`
6. Click "Create Web Service"
7. Wait 2-3 minutes for deployment
8. Your site will be live at: `https://trabahanap.onrender.com`

### Important: Keep Database Persistent
By default, Render deletes data on redeploy. To keep data:
1. In Render dashboard, go to your service
2. Click "Environment" → "Add Environment Variable"
3. Add: `DB_PATH=/var/data/trabahanap.db`
4. In `server.js`, change database path:
   ```javascript
   const dbPath = process.env.DB_PATH || './trabahanap.db';
   const db = new sqlite3.Database(dbPath, ...);
   ```

**Note**: For production, consider upgrading to PostgreSQL on Render for permanent data storage.

## 📱 Mobile Responsiveness

The website automatically adjusts for:
- 📱 Phones (< 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktops (> 1024px)

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### Port 3000 already in use
Change port in `server.js`:
```javascript
const PORT = process.env.PORT || 5000;  // Changed from 3000
```

### Database errors
Delete `trabahanap.db` and restart server - it will recreate automatically

### Styles not loading
Clear browser cache: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)

## 📞 Support Features

- Email validation
- Phone number formatting support
- Facebook profile linking
- Real-time search and filtering
- Local storage for user email

## 🔒 Security Notes

- Input validation on backend
- SQL injection prevention
- XSS attack prevention with HTML escaping
- Barangay whitelist validation

## 📝 License

This project is open-source and free to use.

## 🙏 Contributors

Created for the people of Baliwag, Bulacan

---

**Happy Job Hunting! 🎉 - Trabahanap Team**