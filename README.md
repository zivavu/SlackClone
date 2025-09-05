## Slack Clone (Next.js + MongoDB)

Modern Slack-like chat built with Next.js App Router, MongoDB, and Better Auth. Uses Bun for package management and scripts.

### Highlights

- **Auth**: Email/password + GitHub OAuth via Better Auth
- **Channels**: Create/delete channels; per-channel message history
- **Messaging**: Send, edit, and delete messages
- **Realtime**: Server-Sent Events (SSE) for channel messages and presence
- **Presence**: Online status via heartbeat + realtime stream
- **Files/Avatars**: Upload and serve images via MongoDB GridFS + Sharp
- **UI/UX**: React 19, Tailwind CSS v4, Radix UI, Lucide Icons, dark mode

### Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- TanStack Query for data fetching/caching
- Better Auth + MongoDB adapter
- MongoDB (driver v6), GridFS for file storage
- Tailwind CSS v4, Radix UI, lucide-react, next-themes

---

## Getting Started

We use Bun for everything.

1. Install dependencies

```bash
bun install
```

2. Configure environment

Create `.env.local` in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@<host>/<db>?retryWrites=true&w=majority
MONGODB_DB=slack_clone

# Auth (Better Auth + GitHub)
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=your_url

GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

3. Run the dev server

```bash
bun dev
```

Open `http://localhost:3000`.

4. Build and run production locally

```bash
bun build
bun start
```

Lint:

```bash
bun lint
```

---

## Realtime

- Channel messages: SSE at `/api/channels/:channelId/messages/stream`
- Presence: SSE at `/api/presence/stream`

Client hooks consuming these streams:

- `src/hooks/useChannelMessages.ts`
- `src/hooks/usePresenceHeartbeat.ts`

---

## Data Model (MongoDB)

- `channels` — `{ _id, name, topic?, createdAt }`
- `messages` — `{ _id, channelId, content, authorId?, authorName?, mentions?, createdAt, updatedAt? }`
- `user` — `{ _id, name?, image? }` (managed by Better Auth)
- `presence` — `{ _id, userId, lastSeenAt, status? }`
- GridFS bucket `uploads` — stores avatar images (webp)

Seed helpers exist in `src/app/api/channels/actions.ts` (`seedDefaultChannels`). You can POST to `/api/channels` to create channels.

---

## License

MIT
