# Currency Transfer App

## Quick Start

From the root directory:

```bash
npm start
```

This will concurrently start both the frontend and mock backend services.

## Manual Start

If the root-level start script fails, you can start the services individually:

1. Start the mock backend:
```bash
cd packages/mock-backend
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd packages/frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and the mock backend at `http://localhost:3001` with Swagger documentation at `http://localhost:3001/api-docs`.

## Functionality and assumptions

1. mock-backend is using TypeORM with in-memory sqlite inside as a db,
   and some basic code to make it look like a functioning backend. It does not
   handle a lot of edge cases.

2. Frontend has CRUD for account management, some data is already present in pre-populated DB

3. To quickly find some already existing accounts, try typing "John" or "son" in the search field

4. Due to the massive scope, both frontend and backend are AI-generated under guidance.

## Project Structure

```
currency-test/
├── packages/
│   ├── frontend/     # Next.js frontend application
│   └── mock-backend/ # Express.js mock backend with SQLite
└── package.json      # Root package.json for workspace management
```

## Development Notes

- The project uses a monorepo structure with npm workspaces
- Frontend is built with Next.js 14, RTK Query, and Tailwind CSS
- Backend uses TypeORM with SQLite for data storage
- All necessary configuration files are committed to the repository
- Lock files are committed to ensure dependency version consistency
