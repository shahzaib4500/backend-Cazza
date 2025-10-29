import { PrismaClient } from "@prisma/client";

// Use the packaged Prisma client. The generator may output TypeScript files into
// `src/generated/prisma` during development, but Node cannot import .ts files
// directly. Importing from `@prisma/client` uses tnode -e "import('./src/config/db.js').then(m=>console.log('prisma ok', typeof m.prisma)).catch(e=>console.error(e))"he compiled runtime client.
export const prisma = new PrismaClient({
  log: ["query"],
});
