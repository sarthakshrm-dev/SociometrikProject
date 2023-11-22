const { base64decode } = require('nodejs-base64');
import db from '../../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const session = await getSession({ req: req });
      if (!session) {
        return res.status(401).end(`Not authenticated`);
      }
      const loggedinUser = await db.one(
        'SELECT * FROM users WHERE email = $1;',
        [session.user.email]
      );
      if (!loggedinUser) {
        return res.status(404).end(`User not found`);
      }
      if (loggedinUser.level == 1) {
        const users = await db.query(
          'SELECT * FROM users where level in (2, 3);'
        );
        return res.status(200).json(users);
      } else if (loggedinUser.level == 2) {
        const users = await db.query(
          'SELECT * FROM users where company_id = $1 and level = 3;',
          [loggedinUser.company_id]
        );
        return res.status(200).json(users);
      }
    case 'POST':
      const { _token } = req.body;
      if (_token) {
        const userid = base64decode(_token);
        const user = await db.one('SELECT * FROM users WHERE id = $1;', [
          userid,
        ]);
        return res.status(200).json(user);
      } else {
        return res.status(400).end(`No token found`);
      }
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
