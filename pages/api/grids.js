import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'POST':
      const { town_id } = req.body;
      const grids = await db.query(
        `select * from hexgrid08 where town_cd::citext in ($1:csv)`,
        [town_id],
      );
      return res.status(200).json(grids);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
