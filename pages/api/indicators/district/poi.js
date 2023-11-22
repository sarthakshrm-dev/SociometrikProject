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
      const poi = await db.query(
        'select * from indicatr where broad_catg = $1 and geolevel = $2',
        ['Points of Interest', 'District']
      );
      [...new Set(poi.map((item) => item.sub_catg))].forEach((x) => {
        const obj = new Object();
        obj[x] = [];
        poi
          .filter((y) => y.sub_catg === x)
          .forEach((y) => {
            const f = new Object();
            f['name'] = y.name;
            f['indicatr'] = y.indicatr;
            f['table_name'] = y.table_name;
            f['unit_id'] = y.unit_id;
            obj[x].push(f);
          });
        indicators.push(obj);
      });
      return res.status(200).json(indicators);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
