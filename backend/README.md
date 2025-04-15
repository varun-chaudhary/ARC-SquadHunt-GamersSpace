
# ARC Admin MongoDB Backend

This is the backend server for the ARC Admin Panel, built using Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/arc_admin
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

The server exposes the following API endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get a user by ID (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/:id` - Get an opportunity by ID
- `POST /api/opportunities` - Create a new opportunity (organizers only)
- `PATCH /api/opportunities/:id/status` - Update opportunity status (admin only)

### Organizers
- `GET /api/organizers/:organizerId/opportunities` - Get opportunities for a specific organizer
- `GET /api/organizers/:organizerId/dashboard-stats` - Get dashboard stats for an organizer

### Players
- `GET /api/players/:playerId/opportunities` - Get opportunities that a player has registered for
- `GET /api/players/:playerId/joined-opportunities` - Get opportunities that a player has joined
- `POST /api/players/:playerId/opportunities/:opportunityId/register` - Register for an opportunity
- `POST /api/players/:playerId/opportunities/:opportunityId/join` - Join an opportunity
- `GET /api/players/:playerId/dashboard-stats` - Get dashboard stats for a player
