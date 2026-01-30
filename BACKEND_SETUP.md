# Depthly Setup Guide - MongoDB & Backend

## Step 1: Install MongoDB

### Windows

1. Download MongoDB Community from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the prompts
3. Choose "Install MongoDB as a Service" (recommended)
4. MongoDB should start automatically

### Verify MongoDB is Running

Open PowerShell and run:
```powershell
mongosh
```

If you see a connection prompt, MongoDB is running correctly.

## Step 2: Start the Backend Server

In a PowerShell terminal, navigate to the backend folder and run:

```powershell
cd c:\Users\rashm\Downloads\depthly\backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

## Step 3: Start the Frontend Server

In a separate PowerShell terminal, navigate to the root folder:

```powershell
cd c:\Users\rashm\Downloads\depthly
npm run dev
```

You should see:
```
VITE v6.4.1 ready in XXXX ms
➜ Local: http://localhost:5173/
```

## Step 4: Test the Application

1. Open your browser to http://localhost:5173/
2. Click "Create Account" to sign up
3. Fill in:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: your_password
4. Click "Create Account"
5. You should be redirected to the Explore page
6. The user data is now saved in MongoDB!

## Troubleshooting

### MongoDB Won't Start

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Start the service if it's not running
Start-Service MongoDB

# Or manually start mongod if not installed as service
mongod --dbpath "C:\Users\<YourUsername>\AppData\Local\MongoDB\Data"
```

### Backend Connection Error

- Make sure MongoDB is running first
- Check that port 5000 is not in use
- Verify `.env` file has correct MONGODB_URI

### Frontend Can't Connect to Backend

- Make sure backend is running on port 5000
- Check browser console for CORS errors
- Verify API_KEY is set in frontend `.env`

## What's Now Working

✅ User signup with email validation
✅ User login with password verification
✅ Passwords are securely hashed
✅ JWT token-based authentication
✅ User data persisted in MongoDB
✅ Automatic session management
