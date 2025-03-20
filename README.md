# QXT World - Cue Sports Tournament Management Platform

A comprehensive digital platform for managing cue sports tournaments, featuring real-time scoring, player profiles, and advanced tournament management capabilities.

## Features

- **Tournament Management**
  - Create and manage tournaments
  - Real-time scoring and updates
  - Player registration and bracket management
  - Multiple game formats support

- **Player Profiles**
  - Detailed player statistics
  - Performance tracking
  - Achievement system
  - Tournament history

- **Live Streaming**
  - Match streaming integration
  - Replay system
  - Commentary support
  - Match highlights

- **Equipment Store**
  - Professional equipment listings
  - Player recommendations
  - Used equipment marketplace
  - Sponsorship opportunities

- **Community Features**
  - Player challenges
  - Club directory
  - Social interactions
  - Discussion forums

## Tech Stack

- **Frontend:**
  - React.js with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui components
  - TanStack Query for data fetching
  - WebSocket for real-time updates

- **Backend:**
  - Express.js server
  - PostgreSQL database
  - Drizzle ORM
  - Passport.js authentication
  - WebSocket server

## Prerequisites

- Node.js (v20.x)
- PostgreSQL (v16)
- npm or yarn package manager

## Environment Variables

The following environment variables are required:

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your_session_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLIC_KEY=your_stripe_public
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/qxt-world.git
   cd qxt-world
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility functions
│   │   └── pages/     # Page components
├── server/            # Backend Express application
│   ├── services/     # Business logic
│   ├── routes.ts     # API routes
│   └── auth.ts       # Authentication setup
└── shared/           # Shared types and schemas
```

## Deployment

This application is configured for deployment on Replit:

1. Fork the repository on Replit
2. Set up the required environment variables
3. The application will automatically deploy using the provided `.replit` configuration

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting a pull request

## Roadmap

- [ ] Advanced tournament bracket visualization
- [ ] AI-powered match analysis
- [ ] Mobile application development
- [ ] Integration with additional payment providers
- [ ] Enhanced live streaming capabilities

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- All contributors who have helped build QXT World
- The cue sports community for their valuable feedback
- Open source projects that made this possible