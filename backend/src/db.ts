// Kept for backwards compatibility: reuse the single shared Prisma client
// instead of opening a second connection pool.
export { prisma as pool } from './prisma';
