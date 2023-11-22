import { getSession } from 'next-auth/react';
import { SMTPClient } from 'emailjs';
const { base64encode } = require('nodejs-base64');
import db from '../../../lib/database';

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

    const {
      email,
      company_name,
      subscription_start,
      subscription_end,
      macro_trends,
      market_expansion,
      site_selection,
      customer_segmentation,
      site_monitoring,
      demand_sensing,
    } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(422).json({ message: 'Invalid email' });
    }

    const entries = await db.any('SELECT * FROM users WHERE email = $1;', [
      email,
    ]);
    if (entries && entries.length) {
      return res.status(422).json({ message: 'Duplicate user' });
    }

    const level = loggedinUser.level === 1 ? 2 : 3;
    const user = await db.one(
      'INSERT INTO users(username, email, level) VALUES($1, $2, $3) RETURNING *',
      [email, email, level],
    );

    const userid = base64encode(user.id);
    const client = new SMTPClient({
      user: process.env.EMAIL_HOST_USER,
      password: process.env.EMAIL_HOST_PASSWORD,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      tls: true,
      // ssl: true,
    });
    try {
      let htmlBody = `<div dir="ltr">
      <table id="bodyTable" style="color: #000000; margin: 0px; padding: 0px; font-family: Helvetica, Arial, sans-serif; height: 389.5px; width: 560px; border-collapse: collapse; background-color: #483f64;" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
        <tbody>
          <tr>
            <td id="bodyCell" style="padding: 0px 0px 0px -50px; height: 389.5px;" align="" valign="top">
              <div style="color: #202123; padding: 27px 20px 0px -50px;">
                <img style="margin-left: -50px;" src="https://sociometrik.org/static/media/logo.144dc22df70add83a240.png" alt="logo.png" width="204" height="116" data-surl="cid:ii_lanl3oig1"> 
                <br>
              </div>
              <div style="color: #353740; padding: 0px 20px; text-align: left; line-height: 1.5;">
                <h1 style="color: #ffffff; font-size: 32px; line-height: 40px; margin: 0px 0px 20px; border-color: #e5e7eb;">Verify&nbsp;your email address</h1>
                <p style="font-size: 16px; line-height: 24px; color: #ffffff;">To continue setting up your 
                  <span class="LI ng" data-ddnwab="PR_2_0" aria-invalid="spelling">Sociometrik</span> account, please&nbsp;verify&nbsp;that this is your email address.
                </p>
                <p style="margin: 24px 0px 0px;">
                  <a href="${process.env.NEXTAUTH_URL}/register/${userid}" target="_blank" style="color: white; display: inline-block; text-decoration-line: none; background: #10a37f; border-radius: 3px; font-family: Helvetica, sans-serif; font-size: 16px; line-height: 24px; padding: 12px 20px 11px; margin: 0px;" rel="noopener">Verify&nbsp;email address</a>
                </p>
              </div>
              <div style="text-align: left; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-origin: initial; background-clip: initial; color: #6e6e80; padding: 0px 20px 20px; font-size: 13px; line-height: 1.4;">
                <p style="margin: 0px;">This link will expire in 5 days. If you did not make this request, please disregard this email.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`;
      await client.sendAsync({
        text: `Please complete your registering with us by clicking here ${process.env.NEXTAUTH_URL}/register/${userid}`,
        from: 'Sociometrik <tisha@sociometrik.org>',
        to: email,
        subject: 'Verify your email address',
        attachment: [{ data: htmlBody, alternative: true }],
      });
      if (loggedinUser.level === 1) {
        //setting company
        let company_id = 0;
        const oldcompany = await db.any(
          'select * from companies where name = $1',
          [company_name],
        );
        if (oldcompany && oldcompany.length > 0) {
          company_id = oldcompany[0].id;
          await db.none(
            'update companies set total_users = total_users + 1 where id = $1',
            [company_id],
          );
        } else {
          const newcompany = await db.one(
            'INSERT INTO companies(name, activated_from, activated_to) VALUES($1, $2, $3) RETURNING *',
            [company_name, subscription_start, subscription_end],
          );
          company_id = newcompany.id;
        }

        await db.none('update users set company_id = $1 where id = $2', [
          company_id,
          user.id,
        ]);

        //setting permission
        await db.none(
          'INSERT INTO permissions(user_id, macro_trends, market_expansion, site_selection, customer_segmentation, site_monitoring, demand_sensing) VALUES($1, $2, $3, $4, $5, $6, $7)',
          [
            user.id,
            macro_trends,
            market_expansion,
            site_selection,
            customer_segmentation,
            site_monitoring,
            demand_sensing,
          ],
        );
      } else {
        //setting company
        await db.none(
          'update companies set total_users = total_users + 1 where id = $1',
          [loggedinUser.company_id],
        );
        await db.none(
          'update users set company_id = $1, employee_of = $2 where id = $3',
          [loggedinUser.company_id, loggedinUser.id, user.id],
        );

        //setting permission
        const permission = await db.one(
          'select * from permissions where user_id = $1',
          [loggedinUser.id],
        );
        await db.none(
          'INSERT INTO permissions(user_id, macro_trends, market_expansion, site_selection, customer_segmentation, site_monitoring, demand_sensing) VALUES($1, $2, $3, $4, $5, $6, $7)',
          [
            user.id,
            permission.macro_trends,
            permission.market_expansion,
            permission.site_selection,
            permission.customer_segmentation,
            permission.site_monitoring,
            permission.demand_sensing,
          ],
        );
      }
      return res.status(201).json(user);
    } catch (err) {
      await db.none('delete from users where id = $1', [user.id]);
      return res.status(500).json({
        message:
          'We are experiencing some trouble to process your request right now. Please try again later or contact administrator for help.',
      });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
