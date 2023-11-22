import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'POST':
      const { geolevel, table_name, location } = req.body;
      let sql = '';
      if (geolevel.toLowerCase() == 'h8') {
        sql = `select $1:name.* from hexgrid08 inner join $1:name on hexgrid08.id = $1:name.hex08_key where hexgrid08.town_cd::citext in ($2:csv)`;
      } else {
        sql = `select $1:name.* from village inner join $1:name on village.id = $1:name.village_cd where village.id in ($2:csv)`;
      }
      const data = await db.query(sql, [table_name, location]);
      return res.status(200).json(data);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
