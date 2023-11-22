import db from '../../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
  const method = req.method.toLowerCase();
  if (method === 'post') {
    const session = await getSession({ req: req });
    if (!session) {
      return res.status(401).end(`Not authenticated`);
    }

    const loggedinUser = await db.one('SELECT * FROM users WHERE email = $1;', [
      session.user.email,
    ]);

    if (!loggedinUser) {
      return res.status(404).end(`User not found`);
    }
    if (![1, 2].includes(loggedinUser.level)) {
      return res.status(403).end(`Permission denied`);
    }

    const { id } = JSON.parse(req.body);

    await db.none('delete from permissions where user_id = $1', [id]);
    const user = await db.one('select * from users where id = $1', [id]);
    await db.none(
      'update companies set total_users = total_users - 1 where id = $1',
      [user.company_id],
    );
    await db.none('delete from users where id = $1', [id]);

    const company = await db.one('select * from companies where id = $1', [
      user.company_id,
    ]);
    if (company.total_users == 0) {
      await db.none('delete from companies where id = $1', [company.id]);
    }

    res.status(200).end('Successfully deleted');
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
