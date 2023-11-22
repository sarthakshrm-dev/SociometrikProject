import db from '../../../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'GET':
      const indicators = [];
      const cs = await db.query(
        'select * from cs_indicator where geolevel = $1',
        ['District']
      );
      const level1 = [...new Set(cs.map((item) => item.catg_one))];
      level1.forEach((x) => {
        const obj = new Object();
        obj[x] = new Array();
        const cs2 = cs.filter((y) => y.catg_one === x);
        const level2 = [...new Set(cs2.map((item) => item.catg_two))];
        level2.forEach((y) => {
          const obj2 = new Object();
          obj2[y] = new Array();
          cs.filter((z) => z.catg_two === y && z.catg_one === x).forEach(
            (z) => {
              const f = new Object();
              f['name'] = z.catg_three;
              f['indicatr'] = z.columns_in_table;
              f['table_name'] = z.table_name;
              f['unit_id'] = z.unit_id;
              obj2[y].push(f);
            }
          );
          obj[x].push(obj2);
        });
        indicators.push(obj);
      });
      return res.status(200).json(indicators);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
