# RSS Feed Aggregator CLI

## Requirements

- Node.js 22.15.0 (see `.nvmrc`)
- PostgreSQL database

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a config file at `~/.gatorconfig.json`:
   ```json
   {
     "db_url": "postgres://user:password@localhost:5432/gator",
     "current_user_name": ""
   }
   ```

3. Run database migrations:
   ```bash
   npx drizzle-kit migrate
   ```

## Usage

```bash
npm start <command> [args]
```

## Commands

| Command | Description |
|---------|-------------|
| `register <name>` | Create a new user |
| `login <name>` | Switch to an existing user |
| `users` | List all users |
| `addfeed <name> <url>` | Add a new RSS feed |
| `feeds` | List all feeds |
| `follow <url>` | Follow a feed |
| `following` | List feeds you follow |
| `unfollow <url>` | Unfollow a feed |
| `agg <interval>` | Start aggregating feeds (e.g., `1m`, `30s`) |
| `browse [limit]` | Browse posts from followed feeds |
| `reset` | Reset the database |
