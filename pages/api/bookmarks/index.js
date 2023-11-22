import { getSession } from 'next-auth/react';
import db from '../../../lib/database';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'GET':
      const bookmarks = await db.query(
        'select * from bookmarks order by created_at desc',
      );
      return res.status(200).json(bookmarks);
    case 'POST':
      const loggedinUser = await db.one(
        'SELECT * FROM users WHERE email = $1;',
        [session.user.email],
      );
      const data = req.body;
      const { longitude, latitude, extent, image, zoom, address } = data;
      const bookmark = await db.one(
        'INSERT INTO bookmarks(user_id, location, extent, created_at, image, zoom, address) VALUES($1, point($2, $3), $4, LOCALTIMESTAMP, $5, $6, $7) RETURNING *',
        [loggedinUser.id, longitude, latitude, extent, image, zoom, address],
      );
      return res.status(200).json(bookmark);
    case 'DELETE':
      await db.none('delete from bookmarks where id = $1', [req.query.id]);
      return res.status(200).end('Successfully deleted');
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
