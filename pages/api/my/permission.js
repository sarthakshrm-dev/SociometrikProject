import db from '../../../lib/database';
import { getSession } from 'next-auth/react';

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
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
            const permission = await db.one('SELECT * FROM permissions WHERE user_id = $1;', [
                loggedinUser.id,
            ]);
            return res.status(200).json(permission);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;
