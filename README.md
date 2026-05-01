<p align="center" >
  <img src=".github/logo.svg" width="175" alt="last-commit" >
</p>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/filipebteixeira98/expert-polls?color=739310&style=flat-square">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/filipebteixeira98/expert-polls?color=739310&style=flat-square">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/filipebteixeira98/expert-polls?color=739310&style=flat-square">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/filipebteixeira98/expert-polls?color=739310&style=flat-square">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/filipebteixeira98/expert-polls?color=739310&style=flat-square">
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/filipebteixeira98/expert-polls?color=739310&style=flat-square">
  <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/filipebteixeira98/expert-polls?color=739310&style=flat-square">
</p>

<p align="center">
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=739310&labelColor=808090">
</p>

<p align="center">
  <img alt="React Navigation" src=".github/mockup.png" width="100%">
</p>

## 🚀 Technologies

This project was developed with the following technologies:

- **Node.js**
- **TypeScript**
- **Fastify**
- **Prisma ORM 7**
- **PostgreSQL**
- **Redis**
- **WebSockets**
- **Zod**
- **Docker Compose**

## 🚧 Project

Expert Polls is a backend API for creating polls, registering votes, and streaming live vote updates. It was built as a lightweight real-time voting service using Fastify, Prisma, PostgreSQL, Redis, WebSockets, and TypeScript.

### API Endpoints

### `POST /polls`

Creates a new poll.

Example body:

```json
{
  "title": "What is the best backend framework?",
  "options": ["Fastify", "Express", "NestJS"]
}
```

Example response:

```json
{
  "pollId": "uuid"
}
```

### `GET /polls/:pollId`

Returns a poll with its options and current scores.

Example response:

```json
{
  "poll": {
    "id": "uuid",
    "title": "What is the best backend framework?",
    "options": [
      {
        "id": "option-uuid",
        "title": "Fastify",
        "score": 3
      }
    ]
  }
}
```

### `POST /polls/:pollId/votes`

Registers a vote for a poll option.

Example body:

```json
{
  "pollOptionId": "option-uuid"
}
```

Notes:

- `pollOptionId` must belong to the poll identified by `:pollId`
- the same session cannot vote twice for the same option in the same poll
- the same session can change its vote to another option in the same poll

### `GET /polls/:pollId/results`

Opens a WebSocket connection that emits live vote updates.

Example message:

```json
{
  "pollOptionId": "option-uuid",
  "votes": 4
}
```

## 🧰 Prerequisites

- Node.js (version 18 or later)
- `npm` or `yarn`

## 💻 How to run

```bash
# Clone the repository
git clone https://github.com/filipebteixeira98/expert-polls.git

# Access the project folder
cd expert-polls

# Install the dependencies
npm install
```

_Create a `.env` file based on `.env.example`_

Example:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/polls?schema=public"
```

```bash
# Start infrastructure
docker compose up -d
```

This starts:

- PostgreSQL on port `5432`
- Redis on port `6379`

```bash
# Apply the database schema
npx prisma migrate dev

# If you only want to sync the schema without creating a migration
npx prisma db push

# Run the server (The API will be available at: http://localhost:3333)
npm run dev
```

## 🫶 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is under the MIT license.

<p align="center">
  Made with ♥ by me
</p>
