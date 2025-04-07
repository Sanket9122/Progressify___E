# Progressify Frontend Application

## Installation

1. Ensure you have Node.js (v16 or higher) installed
2. Clone the repository
3. Navigate to the client directory:
   ```bash
   cd client
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Frontend System Design

### Architecture Overview

```
App
├── Router
│   ├── Navbar
│   └── Pages
│       ├── Dashboard
│       └── Teams
└── Utils
    ├── Navigation
    └── Theme
```

### Component Structure

1. **App.js**: Main application wrapper with Router
2. **Components**:
   - Navbar.js: Main navigation component
3. **Pages**:
   - DashBoard.js: Main dashboard view
   - TeamsPage.js: Teams management view
4. **Utils**:
   - navigation.js: Routing configuration
   - theme.js: Theme and styling configuration

## Technologies Used

- React 19
- React Router 7
- Material UI (MUI)
- Emotion for styling
