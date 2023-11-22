import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'POST':
      const { geolevel, table_name, state_id } = req.body;
      let sql = '';
      if (geolevel.toLowerCase() == 'city') {
        sql = `select ${table_name}.* from city inner join ${table_name} on city.id = ${table_name}.town_cd where city.stat_cd in (${state_id.join()})`;
      } else {
        sql = `select ${table_name}.* from district inner join ${table_name} on district.id = ${table_name}.dist_cd where district.stat_cd in (${state_id.join()})`;
      }
      const data = await db.query(sql);
      return res.status(200).json(data);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
