This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Authentication**: Email/password and GitHub OAuth login
- **Real-time messaging**: Slack-like chat interface
- **Channel-based communication**: Organize conversations by topics
- **MongoDB integration**: Persistent data storage

## Getting Started

### 1. Environment Setup

Follow the detailed setup instructions in [`ENV_SETUP.md`](./ENV_SETUP.md) to configure GitHub OAuth and other environment variables.

### 2. Install Dependencies

```bash
bun install
```

### 3. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Test GitHub Login

1. Visit `http://localhost:3000/login`
2. Click the "Continue with GitHub" button
3. Complete GitHub OAuth flow
4. You should be redirected to the client area

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment

Create a `.env.local` file with your secrets.

GitHub OAuth (Better Auth):

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

Dev callback URL:

```
http://localhost:3000/api/auth/callback/github
```
