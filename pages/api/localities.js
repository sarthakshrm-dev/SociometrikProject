import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'GET':
      const localities = await db.query(
        `SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM locality AS t;`,
      );
      return res.status(200).json(localities[0].json_build_object);
    case 'POST':
      const { cities } = req.body;
      const localities2 = await db.query(
        `SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM locality AS t where city in ($1:csv);`,
        [cities],
      );
      localities2[0].json_build_object.features.forEach(
        (x) => (x.properties['isActive'] = true),
      );
      return res.status(200).json(localities2[0].json_build_object);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
