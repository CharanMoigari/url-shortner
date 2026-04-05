# GitHub Actions Deployment Checklist

Complete these steps to set up automated deployment to your EC2 instance.

## ✅ Phase 1: EC2 Preparation (5-10 minutes)

### Step 1.1: Connect to your EC2 instance
```bash
ssh -i your-aws-key.pem ec2-user@51.21.150.242
```

### Step 1.2: Run the setup script
```bash
# Download and run the setup script
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/setup-ec2.sh
chmod +x setup-ec2.sh
./setup-ec2.sh

# Then log out and log back in
exit
ssh -i your-aws-key.pem ec2-user@51.21.150.242
```

Or manually run these commands:
```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
mkdir -p ~/url-shortener
cd ~/url-shortener

# Setup SSH
mkdir -p ~/.ssh
touch ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Step 1.3: Verify installation
```bash
docker --version      # Should show Docker version
docker-compose --version  # Should show docker-compose version
```

**Status:** ☐ EC2 is ready with Docker and Docker Compose installed

---

## ✅ Phase 2: SSH Key Setup (5 minutes)

### Step 2.1: Generate SSH key on your local machine
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions_ec2
# Press Enter for all prompts (no passphrase needed for CI/CD)
```

### Step 2.2: Add public key to EC2
```bash
# Copy public key to EC2
cat ~/.ssh/github_actions_ec2.pub | ssh -i your-aws-key.pem ec2-user@51.21.150.242 "cat >> ~/.ssh/authorized_keys"
```

### Step 2.3: Test SSH connection
```bash
ssh -i ~/.ssh/github_actions_ec2 ec2-user@51.21.150.242
# You should be able to connect without entering a password
# Type 'exit' to disconnect
```

**Status:** ☐ SSH key configured and working

---

## ✅ Phase 3: GitHub Secrets Setup (5 minutes)

### Step 3.1: Get your private key content
```bash
# Display the private key (select all and copy)
cat ~/.ssh/github_actions_ec2
```

### Step 3.2: Add secrets to GitHub

Go to your GitHub repository:
1. Click **Settings** (top right)
2. Click **Secrets and variables** → **Actions** (left sidebar)
3. Click **New repository secret** (green button)

**Add these secrets:**

#### Secret 1: EC2_PRIVATE_KEY
- **Name:** `EC2_PRIVATE_KEY`
- **Secret:** Paste the entire content of the private key file (from step 3.1)
- Click **Add secret**

#### Secret 2: MONGO_URI
- **Name:** `MONGO_URI`
- **Secret:** 
  ```
  mongodb+srv://Charan0405:Cherry0405@cluster0.6yknldk.mongodb.net/url-shortener?retryWrites=true&w=majority
  ```
- Click **Add secret**

#### Secret 3: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Secret:** Create a strong random string (at least 32 characters)
  - Option 1: Use an online generator (recommended): https://www.uuidgenerator.net/
  - Option 2: Run locally: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Click **Add secret**

**Status:** ☐ All 3 secrets added to GitHub

### Step 3.3: Verify secrets in GitHub
- Go to **Settings** → **Secrets and variables** → **Actions**
- You should see:
  - ☐ EC2_PRIVATE_KEY
  - ☐ MONGO_URI
  - ☐ JWT_SECRET

---

## ✅ Phase 4: Verify Docker Configuration (5 minutes)

### Step 4.1: Check Dockerfile configurations

**Client Dockerfile** (`client/Dockerfile`):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

**Server Dockerfile** (`server/Dockerfile`):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Step 4.2: Update .dockerignore if needed
```
node_modules
npm-debug.log
.git
.env
.DS_Store
build
dist
```

**Status:** ☐ Dockerfiles configured for production

---

## ✅ Phase 5: Push Code and Test (5 minutes)

### Step 5.1: Commit all changes
```bash
git add .
git commit -m "Add GitHub Actions CI/CD setup"
```

### Step 5.2: Push to main branch
```bash
git push origin main
```

### Step 5.3: Monitor deployment
1. Go to GitHub → **Actions** tab
2. Click on the latest workflow run titled "Build Docker Images and Deploy to EC2"
3. Watch the workflow progress:
   - **build-and-test** job (1-2 minutes)
   - **build-and-push-client** job (2-3 minutes)
   - **build-and-push-server** job (2-3 minutes)
   - **deploy-to-ec2** job (2-3 minutes)

**Expected outcome:**
- All jobs show ✅ green checkmarks
- Total time: ~10-15 minutes

**If any job fails:**
1. Click on the failed job to see error details
2. Check [Troubleshooting Guide](#troubleshooting) below
3. Fix the issue and push again

**Status:** ☐ Code pushed and deployment successful

---

## ✅ Phase 6: Verify Deployment (5 minutes)

### Step 6.1: Test frontend
```bash
# In your browser or terminal
curl http://51.21.150.242
# Should return HTML content (not an error)
```

### Step 6.2: Test API
```bash
curl http://51.21.150.242/api/
# Should return JSON response or 404 (both indicate API is running)
```

### Step 6.3: Check logs on EC2
```bash
ssh -i ~/.ssh/github_actions_ec2 ec2-user@51.21.150.242

# View running containers
docker ps

# Check nginx logs
docker logs url-shortener-nginx

# Check client logs
docker logs url-shortener-client

# Check server logs
docker logs url-shortener-server
```

### Step 6.4: Test full functionality
1. Open browser and go to http://51.21.150.242
2. Register a new account
3. Log in
4. Create a short URL
5. Test the short URL redirect

**Status:** ☐ All services running correctly

---

## 🎉 Deployment Complete!

Your GitHub Actions CI/CD pipeline is now active. Every time you:
- Push to `main` branch → Automatic deployment to production
- Push to `develop` branch → (Optional) Could be configured for staging

---

## Troubleshooting

### ❌ SSH Connection Error
**Error:** `Permission denied (publickey)`

**Fix:**
1. Verify EC2_PRIVATE_KEY secret is set in GitHub
2. On EC2, check authorized_keys:
   ```bash
   cat ~/.ssh/authorized_keys
   ```
3. If empty, manually add the public key:
   ```bash
   echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

### ❌ Docker Pull Failed
**Error:** `failed to pull image from ghcr.io`

**Fix:**
1. On EC2, log in to GitHub Container Registry:
   ```bash
   docker login ghcr.io
   # Username: your-github-username
   # Password: Your GitHub Personal Access Token
   ```
2. Create a PAT:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Click "Generate new token"
   - Select `read:packages` permission
   - Copy the token and use as password above

### ❌ Port 80 Already in Use
**Error:** `Address already in use`

**Fix:**
1. Check what's using port 80:
   ```bash
   sudo netstat -tlnp | grep :80
   ```
2. Kill the process or change nginx port in workflow

### ❌ Services Not Communicating
**Error:** Frontend can't reach backend API

**Fix:**
1. Check container logs:
   ```bash
   docker logs url-shortener-server
   docker logs url-shortener-nginx
   ```
2. Verify MongoDB connection in server logs
3. Check MONGO_URI secret is correct

### ❌ Cannot Access Application
**Error:** Connection refused at http://51.21.150.242

**Fix:**
1. Check AWS Security Group allows HTTP (port 80)
2. SSH to EC2 and verify containers are running:
   ```bash
   docker ps
   ```
3. Check nginx is listening:
   ```bash
   docker exec url-shortener-nginx netstat -tlnp
   ```

---

## Next Steps (Optional)

### Add HTTPS/SSL
1. Get a domain name (e.g., shorturl.example.com)
2. Update DNS to point to 51.21.150.242
3. Install Let's Encrypt certificate on EC2:
   ```bash
   sudo yum install certbot python3-certbot-nginx -y
   sudo certbot certonly --standalone -d shorturl.example.com
   ```
4. Update nginx configuration with SSL certificates

### Set Up Continuous Monitoring
- Add health check endpoint: `/api/health`
- Enable CloudWatch monitoring in AWS
- Set up email alerts for failures

### Database Backups
- Enable MongoDB Atlas automated backups
- Configure retention policy
- Test restore procedure

### Performance Optimization
- Enable gzip compression (already in nginx.conf)
- Set up CDN for static assets
- Configure caching headers
- Monitor and optimize database queries

---

## Quick Reference Commands

```bash
# SSH into EC2
ssh -i ~/.ssh/github_actions_ec2 ec2-user@51.21.150.242

# View running containers
docker ps

# View deployment logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# View specific container logs
docker logs url-shortener-nginx
docker logs url-shortener-client
docker logs url-shortener-server

# Clean up Docker
docker image prune -a
docker volume prune
```

---

## Support

If you encounter any issues:
1. Check GitHub Actions logs for detailed error messages
2. SSH into EC2 and check container logs
3. Verify all 3 secrets are correctly set in GitHub
4. Ensure EC2 security group allows HTTP/HTTPS traffic
5. Check MongoDB credentials in MONGO_URI secret

**Last Updated:** 2024-12-19
