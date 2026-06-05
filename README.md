<div align="center">

# ✦ Preact WASM Data Forge

**An in-browser PostgreSQL engine powered by WebAssembly, Preact, and `@electric-sql/pglite`. Real PostgreSQL directly in your browser without a backend.**

![Preact](https://img.shields.io/badge/Preact-10-673ab8?style=for-the-badge&logo=preact&logoColor=ffffff)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=ffffff)
![PGlite](https://img.shields.io/badge/PGlite-WASM-336791?style=for-the-badge&logo=postgresql&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=ffffff)
![Vercel](https://img.shields.io/badge/Vercel-ready-000000?style=for-the-badge&logo=vercel&logoColor=ffffff)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

</div>

---

## ✨ Highlights

- **In-Browser Postgres:** Runs a true PostgreSQL environment locally in the browser utilizing WebAssembly (WASM) via `@electric-sql/pglite`.
- **Interactive SQL Editor:** A dedicated code editor interface allows you to write, execute, and view query results instantly.
- **Ephemeral & Fast:** No complex server setups or database provisioning. Boot the app and start writing SQL immediately.
- **Responsive UI:** Sleek, dark-mode focused data forge interface optimized for both desktop and mobile reading.

## 🧱 Project Structure

```text
src/
|-- main.tsx           # Entry point and global layout wrapper
`-- app.tsx            # Main DB initialization, SQL editor, and results table
```

## 🛠️ Tech Stack

- Preact 10 with Vite 6
- `@electric-sql/pglite` for WebAssembly-powered PostgreSQL
- Tailwind CSS 4 for responsive, utility-first styling
- `lucide-preact` for sleek iconography

## 🚀 Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## 🧪 Testing & Queries

The database initializes with a `users` table pre-populated with some demo data. You can execute standard PostgreSQL queries directly in the editor.

**1. View initial data:**
```sql
SELECT * FROM users;
```

**2. Insert new records:**
```sql
INSERT INTO users (name, role) VALUES ('Diana', 'Product Manager');
```

**3. Create and populate a new table:**
```sql
CREATE TABLE projects (id SERIAL PRIMARY KEY, title VARCHAR(100));
INSERT INTO projects (title) VALUES ('Apollo'), ('Artemis');
SELECT * FROM projects;
```

**4. Perform joins:**
```sql
SELECT u.name, p.title 
FROM users u 
CROSS JOIN projects p 
LIMIT 2;
```

## 🔌 Extension Notes & Nuances

- **Persistent Storage:** Currently, the DB is ephemeral (in-memory). You can easily extend this to persist data to the browser's IndexedDB by modifying the initialization to use PGlite's persistence options: `new PGlite('idb://my-database')`.
- **WASM Payload:** `@electric-sql/pglite` relies on WebAssembly. The initial load might take a brief moment as the WASM payload is fetched and compiled. You could add a progress bar for larger network payloads.
- **Standard SQL:** Since it's actual Postgres, you can use all standard Postgres types, functions, and advanced features (like JSONB or CTEs), but keep in mind CPU performance limitations compared to a dedicated backend server.

## 🧪 Build & Checks

```bash
npm run build
npm run preview
```

## 🌐 Vercel Deployment

The repository includes a highly optimized `vercel.json` for Vite static deployment:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📄 License

MIT License. See [LICENSE](./LICENSE).
