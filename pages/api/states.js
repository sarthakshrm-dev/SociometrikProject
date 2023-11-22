import db from '../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }
  switch (req.method) {
    case 'GET':
      const states = await db.query(
        "SELECT json_build_object('type', 'FeatureCollection','features', json_agg(ST_AsGeoJSON(t.*)::json)) FROM state AS t;",
      );
      states[0].json_build_object.features.forEach(
        (x) => (x.properties['isActive'] = true),
      );
      return res.status(200).json(states[0].json_build_object);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
