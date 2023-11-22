import db from '../../../lib/database';

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const company = await db.one('SELECT * FROM companies WHERE id = $1;', [
        req.query.id,
      ]);
      return res.status(200).json(company);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
