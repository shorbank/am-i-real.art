import { db, Comment } from 'astro:db';

export default async function () {
  await db.insert(Comment).values([
    {
      author: 'Evelyn',
      body: 'Walking through the empty hallways felt like drifting in a dream.',
      createdAt: new Date(),
    },
    {
      author: 'Marcus',
      body: 'The blurred lines between nostalgia and unease really hit me.',
      createdAt: new Date(),
    },
    {
      author: 'Lena',
      body: 'Silence can be so loud. This space lingers in my mind.',
      createdAt: new Date(),
    },
  ]);
}
