# HandyFor.Me

<div align="center"><strong>Your personal hub for organizing daily tasks and personal growth.</strong></div>
<div align="center">Built with Next.js, Postgres, and Tailwind CSS.</div>
<br />
<div align="center">
<a href="https://handy-for-me.vercel.app/">Demo</a>
<span> · </span>
<a href="https://github.com/franciskodama/handy-for-me">Repository</a>
</div>

## Overview

**HandyFor.Me** is a personal productivity and mindful living dashboard designed to simplify your journey, inspire growth, and help you achieve more. It features a centralized hub for organizing tasks, visualizing goals, and practicing self-reflection.

### Key Features

- **Dashboard**: A centralized summary of your personal data, including your Bucket List, Vision Board, and Shortcuts.
- **Vision Board**: Visualize your long-term goals with inspiring imagery and motivational content.
- **Bucket List**: Organize and track your life goals across various categories like Adventure, Learning, and more.
- **Weekly Wins**: Track and celebrate your achievements on a weekly basis.
- **Yearly Promises**: Set and monitor your strategic commitments for the year.
- **Decision Helper**: Use a structured tool to help you make better choices.
- **Stoic Support**: Practical tools and principles based on Stoicism to help navigate life's challenges.
- **Random Questions**: Spark reflection or conversation with thought-provoking prompts.
- **Letter Leap**: A creative tool for English language practice.

## Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Auth**: [Auth.js](https://authjs.dev)
- **Database**: [Postgres (Neon)](https://neon.tech)
- **ORM**: [Prisma](https://www.prisma.io)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) & [PostHog](https://posthog.com)
- **Formatting**: [Prettier](https://prettier.io)

## Getting Started

### Prerequisites

- Node.js installed
- A Postgres database (e.g., Vercel Postgres or Neon)
- GitHub and/or Google OAuth credentials for authentication

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/franciskodama/handy-for-me.git
   cd handy-for-me
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your database and auth credentials.

4. Initialize the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
