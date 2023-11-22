import db from '../../../lib/database';

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const bookmark = await db.one('SELECT * FROM bookmarks WHERE id = $1;', [
        req.query.id,
      ]);
      return res.status(200).json(bookmark);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
