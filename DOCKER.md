# URL Shortener - Docker Deployment Guide

This guide explains how to run the entire URL Shortener application using Docker and Docker Compose.

## Prerequisites

- **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Comes with Docker Desktop
- **Git**: Optional, for cloning the repository

## Project Structure

```
url-shortner/
├── client/                 # React frontend
│   ├── Dockerfile         # Client Docker config
│   ├── .dockerignore      # Files to exclude from Docker build
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── Dockerfile         # Server Docker config
│   ├── .dockerignore      # Files to exclude from Docker build
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
├── docker-compose.yml     # Orchestrates all services
├── .dockerignore          # Root level Docker ignore
├── .env.example           # Example environment file
└── README.md
```

## Architecture

The docker-compose setup includes 3 services:

1. **MongoDB** (Database)
   - Image: `mongo:7.0`
   - Port: `27017`
   - Health check enabled
   - Persistent data with volumes

2. **Server** (Node.js Backend)
   - Builds from `./server/Dockerfile`
   - Port: `5000`
   - Environment: Development with `npm run dev`
   - Connected to MongoDB
   - Auto-restart on changes (hot reload)

3. **Client** (React Frontend)
   - Builds from `./client/Dockerfile`
   - Port: `3000`
   - Served with `serve`
   - API URL configured for backend

## Quick Start

### 1. Clone or Navigate to Project

```bash
cd url-shortener
```

### 2. Create Environment File

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

Edit `.env` (optional - defaults are provided):

```env
JWT_SECRET=your-custom-secret-key
NODE_ENV=development
```

### 3. Build and Run with Docker Compose

Start all services:

```bash
docker-compose up --build
```

Or run in detached mode (background):

```bash
docker-compose up -d --build
```

Wait for all services to be healthy (usually 30-60 seconds).

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (internal service)

### 5. View Logs

View all logs:

```bash
docker-compose logs -f
```

View specific service logs:

```bash
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f mongodb
```

## Common Commands

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes (Clean slate)

```bash
docker-compose down -v
```

### Rebuild Services

```bash
docker-compose up --build
```

### Rebuild Specific Service

```bash
docker-compose up --build server
```

### View Running Containers

```bash
docker-compose ps
```

### Execute Command in Container

```bash
docker-compose exec server npm test
docker-compose exec client npm test
```

### View Service Logs

```bash
docker-compose logs mongodb
docker-compose logs server
docker-compose logs client
```

## Environment Variables

### Server (Auto-configured)

| Variable | Value | Purpose |
|----------|-------|---------|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://admin:password@mongodb:27017/url-shortener?authSource=admin` | MongoDB connection |
| `JWT_SECRET` | From `.env` file | JWT token encryption |
| `NODE_ENV` | `development` | Environment mode |

### Client (Auto-configured)

| Variable | Value | Purpose |
|----------|-------|---------|
| `REACT_APP_API_URL` | `http://localhost:5000` | Backend API endpoint |

### MongoDB (Auto-configured)

| Variable | Value | Purpose |
|----------|-------|---------|
| `MONGO_INITDB_ROOT_USERNAME` | `admin` | Admin username |
| `MONGO_INITDB_ROOT_PASSWORD` | `password` | Admin password |
| `MONGO_INITDB_DATABASE` | `url-shortener` | Default database |

## Volumes and Data Persistence

Docker volumes are created for:

- **mongodb_data**: Stores MongoDB database files
- **mongodb_config**: Stores MongoDB configuration

Data persists even after containers stop. To reset:

```bash
docker-compose down -v
```

## Network

All services communicate through a custom bridge network: `url-shortener-network`

- `mongodb:27017` - MongoDB service name (used by server)
- `server:5000` - Server service name (used by client)
- `client:3000` - Client service name

Services can reference each other by service name instead of localhost.

## Development Workflow

### Working with Source Code

With `docker-compose up`, changes to code are reflected:

- **Server**: Hot reload with `nodemon`
- **Client**: Hot reload with React dev server

Edit files locally and changes will be reflected in running containers.

### Installation Dependencies

If you add new npm packages:

```bash
# For client
docker-compose exec client npm install package-name

# For server
docker-compose exec server npm install package-name
```

Or rebuild:

```bash
docker-compose up --build
```

## Troubleshooting

### Port Already in Use

If ports 3000, 5000, or 27017 are in use:

Edit `docker-compose.yml` and change port mappings:

```yaml
ports:
  - "3001:3000"  # Changed from 3000:3000
```

### MongoDB Not Starting

Check MongoDB logs:

```bash
docker-compose logs mongodb
```

Ensure ports aren't blocked by firewall.

### Frontend Can't Connect to Backend

Check that:
1. Server is running: `docker-compose logs server`
2. `REACT_APP_API_URL` is set correctly in docker-compose.yml
3. Clear browser cache
4. Check browser console for errors

### Container Crashes on Startup

View logs:

```bash
docker-compose logs service-name
```

Rebuild without cache:

```bash
docker-compose build --no-cache
docker-compose up
```

### Database Connection Error

Ensure MongoDB is healthy:

```bash
docker-compose ps
```

Look for `(healthy)` status. Wait a few seconds and try again.

## Production Deployment

### Important Security Changes

For production, update:

1. **docker-compose.yml**:
   - Change MongoDB credentials
   - Update `JWT_SECRET`
   - Set `NODE_ENV=production`

2. **Server Dockerfile**:
   - Use `npm start` instead of `npm run dev`
   - Remove `nodemon`

3. **Add reverse proxy** (nginx)
4. **Enable HTTPS** (Let's Encrypt)
5. **Set up proper secrets management**

### Example Production docker-compose.yml Changes

```yaml
server:
  environment:
    NODE_ENV: production
  command: npm start

client:
  build:
    context: ./client
    target: production
```

## Docker Images Used

- **node:20-alpine**: Lightweight Node.js image
- **mongo:7.0**: Official MongoDB image

## File Structure After Build

```
url-shortener/
├── .dockerignore
├── .env                    # Your custom env file
├── docker-compose.yml      # Orchestration config
├── client/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── server/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── ...
└── README.md
```

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/README.md)

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Rebuild: `docker-compose up --build`
3. Reset everything: `docker-compose down -v`

## License

ISC
