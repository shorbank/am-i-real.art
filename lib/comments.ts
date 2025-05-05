import { db, Comment } from "astro:db";

export async function getLatestComments(limit = 95) {
  return db
    .select()
    .from(Comment)
    .orderBy(Comment.createdAt)
    .limit(limit);
}
