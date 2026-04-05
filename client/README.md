# URL Shortener Frontend

A modern React-based frontend for the URL Shortener application. Built with React Router for navigation, context API for state management, and CSS for styling.

## Features

- User authentication (Register/Login)
- Create and manage shortened URLs
- View URL statistics (click counts, creation date)
- Copy short URLs to clipboard
- Share short URLs (with native share API fallback)
- Delete URLs
- JWT token-based secure authentication
- Responsive design
- Beautiful gradient UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create/Update `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

### Development mode:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Build for production:
```bash
npm run build
```

### Run tests:
```bash
npm test
```

## Project Structure

```
client/src/
├── pages/
│   ├── Home.js            # Landing page
│   ├── Register.js        # User registration page
│   ├── Login.js           # User login page
│   ├── Dashboard.js       # Main dashboard with URL management
│   ├── Home.css           # Home page styles
│   ├── Auth.css           # Auth pages styles
│   └── Dashboard.css      # Dashboard styles
├── components/
│   ├── URLCard.js         # URL display card component
│   ├── URLCard.css        # URL card styles
│   └── ProtectedRoute.js  # Route protection component
├── AuthContext.js         # Authentication context (state management)
├── api.js                 # API utility functions
├── App.js                 # Main app component with routing
├── App.css                # Global app styles
├── index.js               # Entry point
├── index.css              # Global styles
├── .env                   # Environment variables (Git ignored)
├── .env.example           # Example env file
└── package.json           # Dependencies and scripts
```

## Pages and Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/` | Home | No | Landing page with features overview |
| `/register` | Register | No | User registration |
| `/login` | Login | No | User login |
| `/dashboard` | Dashboard | Yes | Main dashboard for URL management |

## Features Explained

### Authentication
- Register: Create a new account with name, email, and password
- Login: Sign in with email and password
- JWT tokens are stored in localStorage for persistent sessions
- Automatic redirect to login if token is missing

### URL Management
- **Create**: Paste a long URL and get a shortened version
- **View**: See all your shortened URLs with statistics
- **Copy**: One-click copy to clipboard
- **Share**: Native browser share or copy-to-clipboard
- **Delete**: Remove URLs you no longer need
- **Track**: View click counts and creation dates

### State Management
- **AuthContext**: Manages user authentication state globally
- **useAuth hook**: Easy access to auth state in any component

## API Integration

The frontend communicates with the backend API using the `api.js` utility:

### Auth API
- `authAPI.register(name, email, password)` - Register user
- `authAPI.login(email, password)` - Login user

### URL API
- `urlAPI.createUrl(originalUrl, token)` - Create short URL
- `urlAPI.getAllUrls(token)` - Fetch user's URLs
- `urlAPI.getUrl(id, token)` - Fetch single URL
- `urlAPI.deleteUrl(id, token)` - Delete URL

## Styling

The app uses CSS with modern features:
- CSS Grid for layouts
- Flexbox for alignment
- CSS variables for theming
- Gradient backgrounds
- Smooth transitions and hover effects
- Mobile-responsive design

### Color Scheme
- Primary: `#667eea` to `#764ba2` (gradient)
- Success: `#27ae60`
- Error: `#e74c3c`
- Background: `#f5f5f5`
- Text: `#333`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000 |

## Error Handling

The app includes comprehensive error handling:
- Network error messages are displayed to users
- Form validation on both client and server
- Protected routes redirect unauthorized users
- Graceful loading and error states

## Best Practices

1. **State Management**: Uses React Context API for simplicity
2. **Code Organization**: Clear separation of concerns (pages, components, utilities)
3. **Error Handling**: User-friendly error messages
4. **Security**: JWT tokens for authentication, localStorage for persistence
5. **Performance**: Efficient re-renders with React hooks
6. **Responsiveness**: Mobile-first CSS design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend not connecting
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

### Auth not persisting
- Check if localStorage is enabled
- Clear browser cache and try again
- Verify JWT token validity

### Styling issues
- Clear browser cache
- Rebuild with `npm run build`
- Check CSS files are imported correctly

## Technologies Used

- **React** - UI library
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **CSS3** - Styling with modern features
- **JavaScript ES6+** - Modern JavaScript

## Available Scripts

```bash
# Start development server
npm start

# Create production build
npm run build

# Run tests
npm test

# Eject (not reversible)
npm run eject
```

## License

ISC

## Next Steps

1. Install dependencies: `npm install`
2. Update `.env` with your backend URL
3. Run `npm start`
4. Register or login to get started
5. Create your first short URL!

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
