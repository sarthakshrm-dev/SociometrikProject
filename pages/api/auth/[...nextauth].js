import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '../../../lib/database';
import bcrypt from 'bcryptjs';

export default NextAuth({
  site: process.env.NEXTAUTH_URL,
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await db.one('SELECT * FROM users WHERE email = $1;', [
          credentials.email,
        ]);
        if (!user) {
          throw new Error('No user found');
        }
        const isValid = bcrypt.compareSync(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Wrong password');
        }
        await db.none(
          'update users set last_login_at = LOCALTIMESTAMP where email = $1',
          [user.email],
        );
        return { email: user.email };
      },
    }),
  ],
});
