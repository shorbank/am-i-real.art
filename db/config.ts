import { defineDb, defineTable, column } from 'astro:db';

const Comment = defineTable({
  columns: {
    author: column.text(),
    body: column.text(),
    createdAt: column.date(),
  },
});

export default defineDb({
  tables: { Comment },
});
