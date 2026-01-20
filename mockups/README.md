# ReferMe - HTML Mockups

Interactive HTML mockups for the ReferMe application - a professional referral community inspired by Blind.

## Getting Started

Open any `.html` file in your browser to explore the mockups. All pages are interlinked and fully clickable.

**Start here:** Open `index.html` (landing page)

## Pages Overview

### 1. **index.html** - Landing Page
- Value proposition and hero section
- Feature highlights
- Stats showcase
- Call-to-action buttons

### 2. **signup.html** - Sign Up Page
- Work email verification form
- User registration fields
- Terms acceptance
- Links to login

### 3. **login.html** - Login Page
- Email/password authentication
- Remember me option
- Forgot password link

### 4. **verify-email.html** - Email Verification
- Post-signup verification notice
- Instructions for next steps
- Resend email option

### 5. **home.html** - Home Feed (Main App)
- Left sidebar: Company bowls list
- Center: Post feed with upvotes/comments
- Right sidebar: User stats, leaderboard, LinkedIn prompt
- Different post types: general, referral offers, referral requests
- Navigation to all main features

### 6. **bowl.html** - Company Bowl (e.g., Microsoft)
- Company-specific discussions
- Filter by topic (referrals, career, salary, etc.)
- Pinned posts
- Top contributors sidebar
- Company-specific stats

### 7. **referrals.html** - Referral Board
- Toggle between "Giving Referrals" and "Seeking Referrals"
- Search and filter by company/role
- Detailed referral cards with requirements
- Stats sidebar
- Send DM buttons

### 8. **post.html** - Post Detail Page
- Full post content
- Upvote/downvote functionality
- Threaded comment system
- Reply functionality
- User verification badges

### 9. **profile.html** - User Profile
- Profile header with company badge
- Stats: karma points, referrals given, posts, DMs remaining
- Badges collection
- LinkedIn connection status
- Leaderboard ranking
- About section with skills
- Referral availability toggle with criteria
- Activity tabs (posts, comments, upvoted)

### 10. **messages.html** - Direct Messages
- Conversation list sidebar
- Active conversation view
- Real-time typing indicators
- File attachments support
- DM limit counter (7/10 remaining)
- Message timestamps

### 11. **create-post.html** - Create Post
- Three post types:
  - **General Post**: Regular discussions
  - **Offer Referral**: Post job openings you can refer for
  - **Request Referral**: Request help getting into companies
- Bowl selection
- Rich form fields
- Tags support

## Key Features Demonstrated

### 🔐 Trust & Verification
- Work email verification badges
- Company-specific bowls
- Optional LinkedIn integration

### 💬 Community Features
- Discussion forums (bowls)
- Upvote/downvote system
- Threaded comments
- Post types: general, referral offers, referral requests

### 🤝 Referral Marketplace
- Two-sided board (giving + seeking)
- Detailed job requirements
- Search and filters
- Direct messaging

### 🎯 Gamification
- Karma points system
- Badges (Top Contributor, Helpful, Referral Pro, etc.)
- Leaderboard rankings
- DM limits that increase with karma

### 💌 Messaging
- Limited DMs (10/month base, increases with points)
- Real-time chat interface
- File sharing
- Typing indicators

## Design Notes

- **Colors**: Blue primary (#2563EB), clean gray palette
- **Style**: Inspired by Blind - professional, clean, modern
- **Framework**: Tailwind CSS via CDN (no build required)
- **Responsive**: Mobile-friendly layouts
- **Interactive**: Clickable navigation between all pages

## Next Steps for Development

When building the real application:

1. **Mock-first approach** (as discussed):
   - Create mock services/APIs first
   - Define clear API contracts
   - Write integration tests against mocks
   - Swap in real database later

2. **Recommended Tech Stack**:
   - **Frontend**: Next.js 14+ with Tailwind CSS + shadcn/ui
   - **Backend**: Next.js API routes initially
   - **Database**: Supabase (PostgreSQL + Auth + Realtime)
   - **Deployment**: Vercel

3. **Development Phases**:
   - Phase 1: Auth + basic profiles + simple forum
   - Phase 2: DMs + points system + upvote/downvote
   - Phase 3: Advanced features + polish

## File Structure
```
mockups/
├── index.html              # Landing page
├── signup.html             # Sign up
├── login.html              # Login
├── verify-email.html       # Email verification
├── home.html               # Main feed
├── bowl.html               # Company bowl
├── referrals.html          # Referral board
├── post.html               # Post detail
├── profile.html            # User profile
├── messages.html           # DM interface
├── create-post.html        # Create post
└── README.md              # This file
```

## Notes

- All mockups use static dummy data
- Navigation is functional between pages
- Forms link to appropriate next pages
- Interactive elements (buttons, tabs) work via simple JavaScript
- No backend - purely frontend mockups

---

**Built with ❤️ for ReferMe - The Professional Referral Community**
