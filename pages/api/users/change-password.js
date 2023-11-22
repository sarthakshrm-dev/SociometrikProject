import { getSession } from 'next-auth/react';
import db from '../../../lib/database';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  const method = req.method.toLowerCase();
  if (method !== 'patch') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getSession({ req: req });
  if (!session) {
    return res.status(401).end(`Not authenticated`);
  }

  const data = req.body;
  const { newpassword, oldpassword } = data;
  const email = session.user.email;

  const user = await db.one('SELECT * FROM users WHERE email = $1;', [email]);
  if (!user) {
    return res.status(404).end(`User not found`);
  }

  const isValid = bcrypt.compareSync(oldpassword, user.password);
  if (!isValid) {
    return res.status(403).end(`Invalid password`);
  }

  const hashedPassword = bcrypt.hashSync(newpassword, 10);
  await db.none('update users set password = $1 where id = $2', [
    hashedPassword,
    user.id,
  ]);
  res.status(200).end(`Password updated`);
}

export default handler;
