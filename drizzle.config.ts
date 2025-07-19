// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `${process.env.POSTGRES_URL || "postgresql://predify_user:predify_password@localhost:5432/predify"}?sslmode=disable`,
  },
});
