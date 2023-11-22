import db from '../../../lib/database';

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const companies = await db.query('SELECT * FROM companies;');
      return res.status(200).json(companies);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
