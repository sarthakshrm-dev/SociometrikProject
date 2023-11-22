import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'POST':
      const { tradeArea, id } = req.body;
      const table_name = `site_monitor_${tradeArea}m`;
      const data = await db.one(`SELECT * FROM $1:name where id=$2`, [
        table_name,
        id,
      ]);
      return res.status(200).json(data);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
