import db from '../../../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'GET':
      const indicators = await db.query(
        'select * from indicatr where broad_catg = $1 and geolevel = $2',
        ['Footfall', 'Village'],
      );
      return res.status(200).json(indicators);
    case 'POST':
      const { tn, arrayOfIds } = req.body;
      const indicators2 = await db.query(
        'select * from $1:name where village_cd in ($2:csv)',
        [tn, arrayOfIds],
      );
      return res.status(200).json(indicators2);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
