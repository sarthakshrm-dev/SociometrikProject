import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'GET':
      const competitors = [];
      const records = await db.query('select * from competitors');
      [...new Set(records.map((item) => item.sub_catg))].forEach((x) => {
        const obj = new Object();
        obj[x] = [];
        records
          .filter((y) => y.sub_catg === x)
          .forEach((y) => {
            const f = new Object();
            f['name'] = y.brand_name;
            f['indicatr'] = y.brand_code;
            obj[x].push(f);
          });
        competitors.push(obj);
      });
      return res.status(200).json(competitors);
    case 'POST':
      const { brand_code, city_id } = req.body;
      const poi = await db.query(
        `SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM poi AS t where brand_code in ($1:csv) and city_id in ($2:csv);`,
        [brand_code, city_id],
      );
      return res.status(200).json(poi[0].json_build_object);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
