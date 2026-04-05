# MongoDB Atlas Setup Guide

This guide explains how to set up MongoDB Atlas and connect it to your URL Shortener application.

## What is MongoDB Atlas?

MongoDB Atlas is a fully managed cloud database service that hosts MongoDB. It's free to get started and perfect for development and production use.

## Steps to Create MongoDB Atlas Account and Database

### 1. Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"** (or **"Try for Free"**)
3. Fill in your details:
   - Email
   - Password
   - First Name
   - Last Name
4. Accept terms and click **"Create your MongoDB account"**
5. Verify your email

### 2. Create a Project

1. Once logged in, click **"Create"** to create a new project
2. Enter a project name (e.g., "url-shortener")
3. Click **"Create Project"**

### 3. Create a Database Cluster

1. Click **"Build a Database"**
2. Choose **"M0 Shared"** (Free tier - perfect for development)
3. Select your preferred region (closest to you)
4. Click **"Create"** (wait 2-3 minutes for cluster to be ready)

### 4. Create Database User (Credentials)

1. Go to **"Database Access"** (left sidebar under Security)
2. Click **"Add New Database User"**
3. Set username: `url-shortener` (or your preferred username)
4. Set password: Create a strong password
5. Click **"Add User"**
6. Copy and save your username and password safely

### 5. Add Your IP to Whitelist

1. Go to **"Network Access"** (left sidebar under Security)
2. Click **"Add IP Address"**
3. For development: Click **"Allow access from anywhere"** (add `0.0.0.0/0`)
4. Click **"Confirm"**

⚠️ **Security Note**: For production, add only specific IP addresses instead of allowing all.

### 6. Get Your Connection String

1. Go back to **"Databases"**
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"3.12 or later"**
5. Copy the connection string
6. It will look like:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/url-shortener?retryWrites=true&w=majority
   ```

## Setting Up Your Application

### Option 1: Using Docker Compose

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace the MONGO_URI:
   ```env
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/url-shortener?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

3. Run Docker Compose:
   ```bash
   docker-compose up --build
   ```

### Option 2: Local Development (No Docker)

1. Update `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/url-shortener?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   ```

2. Start the backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. In another terminal, start the frontend:
   ```bash
   cd client
   npm install
   npm start
   ```

## Connection String Format

Your connection string format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Components:**
- `username`: Database user you created
- `password`: User password
- `cluster-name`: Your cluster name (e.g., `cluster0.6yknldk`)
- `database-name`: Database to use (e.g., `url-shortener`)
- `?retryWrites=true&w=majority`: Write concern settings for reliability

## Verify Connection

### Using mongo shell

1. Install MongoDB Shell: [mongosh](https://www.mongodb.com/try/download/shell)
2. Run:
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/url-shortener"
   ```
3. You should see connection successful

### Using Application

1. Start your application
2. Register a new account
3. Create a short URL
4. Check MongoDB Atlas:
   - Go to **Databases**
   - Click **Browse Collections**
   - You should see `users` and `urls` collections with data

## Troubleshooting

### Connection Refused Error

**Cause**: IP not whitelisted
**Solution**:
1. Go to **Network Access**
2. Add your IP or allow `0.0.0.0/0` for development

### Wrong Credentials Error

**Cause**: Username or password incorrect
**Solution**:
1. Go to **Database Access**
2. Reset password or create new user
3. Update your connection string

### Database Not Found Error

**Cause**: Database name doesn't exist in connection string
**Solution**: Ensure `url-shortener` is in your connection string, or the database will be created automatically when you insert data

### Cannot Connect to Cluster

**Cause**: Cluster not running or too new
**Solution**: Wait 5 minutes after creating cluster, refresh the page

## Production Deployment

### Important Security Changes

1. **Create dedicated user** for production (different from development)
2. **Use strong password** with special characters
3. **Whitelist specific IPs** instead of allowing all
4. **Enable VPC peering** for cloud-to-cloud connections
5. **Use environment variables** for credentials (never hardcode)
6. **Enable encryption** at rest and in transit
7. **Set up backups** and point-in-time recovery

### Example Production Setup

1. Create new user: `prod-url-shortener`
2. Add only your server IP to whitelist
3. Update `.env` with production credentials
4. Deploy using Docker or your hosting platform

## MongoDB Atlas Dashboard

Once connected, you can:

- **View Collections**: See all your data
- **Run Queries**: Test queries directly in the dashboard
- **Monitor Performance**: Check connection metrics
- **Create Indexes**: Optimize database performance
- **Set up Alerts**: Get notified of issues
- **Enable Backups**: Automatic daily backups

## Pricing

**M0 Cluster** (Free):
- 512 MB storage
- Shared resources
- Perfect for development and learning
- Never expires!

**M2 & M5** (Paid):
- 10-512 GB storage
- Dedicated resources
- Scales as you grow

## Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js MongoDB Driver](https://docs.mongodb.com/drivers/node/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
- [MongoDB Community Forum](https://community.mongodb.com/)

## Next Steps

1. ✅ Create MongoDB Atlas account
2. ✅ Create cluster
3. ✅ Create database user
4. ✅ Whitelist IP
5. ✅ Get connection string
6. ✅ Update `.env` file
7. ✅ Run your application
8. ✅ Start creating short URLs!

Happy coding! 🚀
