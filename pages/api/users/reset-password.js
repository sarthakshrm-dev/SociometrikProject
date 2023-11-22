import db from '../../../lib/database';
const { base64encode } = require('nodejs-base64');
import { getSession } from 'next-auth/react';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  const session = await getSession({ req: req });
  if (session) {
    return res.status(401).end(`Authenticated`);
  }
  switch (req.method) {
    case 'POST':
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(422).json({ message: 'Invalid email' });
      }
      const user = await db.one('SELECT * FROM users WHERE email = $1;', [
        email,
      ]);
      if (!user) {
        return res.status(404).json({ message: 'No user found' });
      }
      const userid = base64encode(user.id);
      const validity = base64encode(Math.floor(Date.now() / 1000) + 180);
      const url = `${process.env.NEXTAUTH_URL}/reset-password/${userid}-${validity}`;
      return res.status(200).json({ redirect: url });
    case 'PATCH':
      const { password, userId } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);
      await db.none('update users set password = $1 where id = $2', [
        hashedPassword,
        userId,
      ]);
      return res.status(200).end('Successfully updated');
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
