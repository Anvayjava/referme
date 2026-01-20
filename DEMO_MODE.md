# Demo Mode Guide

ReferMe supports two modes of operation: **Demo Mode** and **Production Mode**.

## Demo Mode vs Production Mode

### Demo Mode
- Uses localStorage for all data storage
- No database connection required
- Perfect for testing, development, and demos
- Mock authentication (no real email verification)
- All data is stored in browser localStorage

### Production Mode
- Uses Supabase for all data storage
- Real authentication with email verification
- Persistent data across devices
- Requires Supabase configuration

## How to Switch Between Modes

### Option 1: Using Environment Variable

Edit `/Users/vibhorjain/Documents/ReferMe/app/.env.local` and set:

```bash
# For Demo Mode
NEXT_PUBLIC_DEMO_MODE=true

# For Production Mode (Supabase)
NEXT_PUBLIC_DEMO_MODE=false
```

After changing the environment variable, restart your development server:

```bash
npm run dev
```

### Option 2: Default Behavior

By default, the app is set to **Production Mode** (`NEXT_PUBLIC_DEMO_MODE=false`).

## Features in Each Mode

### Authentication
- **Demo Mode**: Mock login with localStorage, any work email works
- **Production Mode**: Real Supabase Auth with email verification

### Data Storage
- **Demo Mode**:
  - Posts stored in `localStorage.userPosts`
  - User data in `localStorage.currentUser`
  - Votes in `localStorage.userVotes`
  - Messages in `localStorage.messages`
  - Comments are temporary (not persisted)

- **Production Mode**:
  - All data stored in Supabase database
  - Posts, comments, votes, messages, users in PostgreSQL
  - Real-time updates available

### Creating Posts
- **Demo Mode**: Saves to localStorage, persists in browser only
- **Production Mode**: Saves to Supabase database, persists across devices

### Voting
- **Demo Mode**: Tracks votes in localStorage
- **Production Mode**: Saves votes to database with proper user attribution

### Comments
- **Demo Mode**: Shows pre-defined mock comments, new comments are temporary
- **Production Mode**: Full comment functionality with persistence

### Messages
- **Demo Mode**: Messages stored in localStorage, persists in browser only
- **Production Mode**: Messages saved to Supabase database, persists across devices

## Testing Demo Mode

1. Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`
2. Restart the dev server
3. Sign up with any work email (e.g., `test@company.com`, password: `test1234`)
4. Login automatically works without email verification
5. Create posts, vote, and comment
6. Data persists in browser localStorage

## Testing Production Mode

1. Set `NEXT_PUBLIC_DEMO_MODE=false` in `.env.local`
2. Ensure Supabase credentials are configured
3. Restart the dev server
4. Sign up with a real work email
5. Check email for verification link
6. Click verification link to activate account
7. Login with verified credentials
8. All data is stored in Supabase

## Troubleshooting

### Changes not taking effect
- Restart the development server after changing `.env.local`
- Clear browser localStorage to reset demo data
- Check browser console for errors

### Demo mode data not persisting
- Demo mode uses localStorage which is browser-specific
- Data will be lost if you clear browser data
- Use Production Mode for persistent data

### Can't login in Production Mode
- Check that Supabase credentials are correct
- Verify email must be clicked before login
- Check Supabase dashboard for user status

## Recommended Use Cases

### Use Demo Mode for:
- Local development
- Testing features quickly
- Demos and presentations
- Development without database setup

### Use Production Mode for:
- Actual deployment
- Testing real database interactions
- Email verification flows
- Multi-user testing
- Production environment
