import db from '../../../lib/database';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  const method = req.method.toLowerCase();
  if (method === 'post') {
    const data = req.body;
    const { email, full_name, password, phone, designation, department } = data;

    if (!full_name || !password || password.trim().length < 6 || !phone) {
      return res.status(422).json({ message: 'Invalid input' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await db.one(
      'update users set full_name = $1, password = $2, phone = $3, designation = $4, department = $5, updated_at = LOCALTIMESTAMP where email = $6 RETURNING *',
      [full_name, hashedPassword, phone, designation, department, email]
    );
    return res.status(200).json(user);
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
