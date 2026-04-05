# URL Shortener Backend

A complete Node.js + Express backend for a URL Shortener application with MongoDB Atlas integration.

## Features

- User authentication (Register/Login) with JWT tokens
- Create and manage shortened URLs
- Click tracking for shortened URLs
- RESTful API with proper error handling
- Password hashing with bcryptjs
- CORS support for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortner?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Running the Server

### Development mode (with nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ name, email, password }`
- **Response**: JWT token and user info

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: JWT token and user info

### URL Management (Requires JWT authentication)

#### Create Short URL
- **POST** `/api/urls`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ originalUrl }`
- **Response**: Short URL object with shortId

#### Get All URLs
- **GET** `/api/urls`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of all URLs for logged-in user

#### Get Specific URL
- **GET** `/api/urls/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Single URL object with click stats

#### Delete URL
- **DELETE** `/api/urls/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Redirect

#### Visit Short URL
- **GET** `/:shortId`
- **Response**: Redirects to original URL (increments click counter)

### Health Check

- **GET** `/api/health`
- **Response**: Server status

## Project Structure

```
server/
├── models/
│   ├── User.js          # User schema and methods
│   └── URL.js           # URL schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── urls.js          # URL CRUD routes
│   └── redirect.js      # Redirect handler
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── index.js             # Main server file
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
└── README.md            # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB Atlas connection string | Required |
| JWT_SECRET | Secret key for JWT signing | Required |
| NODE_ENV | Environment (development/production) | development |

## Technologies Used

- **Express.js** - Web framework
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nanoid** - Unique ID generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development tool for auto-restart

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict
- `500` - Server error

## Security Notes

1. Always update `JWT_SECRET` in production
2. Use HTTPS in production
3. Implement rate limiting in production
4. Validate and sanitize user inputs
5. Use environment variables for sensitive data
6. Keep dependencies updated

## License

ISC
