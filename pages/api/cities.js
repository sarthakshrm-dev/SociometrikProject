import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'POST':
      const { state_id, f } = req.body;
      const cities = await db.query(
        `SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM city AS t where stat_cd in ($1:csv);`,
        [state_id],
      );
      if (f === 'site-selection') {
        const grids = await db.query(
          `select * from hexgrid08 where stat_cd in ($1:csv);`,
          [state_id],
        );
        cities[0].json_build_object.features.forEach((x) => {
          let count = grids.filter(
            (y) => y.town_cd === x.properties.town_cd,
          ).length;
          x.properties['isActive'] = count > 0 ? true : false;
        });
      } else {
        cities[0].json_build_object.features.forEach(
          (x) => (x.properties['isActive'] = true),
        );
      }
      return res.status(200).json(cities[0].json_build_object);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
