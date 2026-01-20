# ReferMe

A professional referral community platform where verified employees can offer referrals and job seekers can request them.

## Features

- 🔐 **Secure Authentication** - Work email verification required
- 💼 **Referral Marketplace** - Offer or request referrals
- 🏢 **Company Bowls** - Company-specific discussion boards
- 💬 **Direct Messaging** - Connect with potential referrers
- ⬆️ **Voting System** - Community-driven content ranking
- 💎 **Karma Points** - Reward system for active members

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for production mode)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ReferMe
```

2. Install dependencies:
```bash
cd app
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEMO_MODE=false
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Mode

ReferMe supports a demo mode for testing without a database:

1. Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`
2. Restart the dev server
3. All data will be stored in localStorage

See [DEMO_MODE.md](DEMO_MODE.md) for detailed documentation.

## Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy the contents of supabase_schema.sql
# Paste into Supabase SQL Editor
# Run the query
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Set root directory to `app`
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEMO_MODE=false`
5. Deploy!

## Project Structure

```
ReferMe/
├── app/                    # Next.js application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json
├── mockups/               # Design mockups
├── supabase_schema.sql    # Database schema
└── DEMO_MODE.md          # Demo mode documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
