import { formSchema } from '@/common/types/form-data';
import db from '@/server/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userToken = req.headers.authorization?.split(' ')[1];

  if (!userToken) {
    res.status(403).json({ error: 'Invalid token' });
    return;
  }

  switch (req.method) {
    case 'GET': {
      const user = await db.findUserByToken(userToken);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      } else {
        res.status(200).json({ user });
      }
    }
    case 'PUT': {
			let payload = null;
			try {
				payload = formSchema.parse(req.body) 
				
			} catch (error: unknown) {
				if (error instanceof ZodError) {
					res.status(404).json({ error: error.errors.map((e) => e.message) });
					return;
				}
				res.status(400).json({ error: "Bad Request" });
			}

      const user = await db.findUserByToken(userToken);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (payload?.email) {
        user.email = req.body.email;
      }

      if (payload?.name) {
        user.name = req.body.name;
      }

      const success = await db.updateUser(user.id, user);

      if (success) {
        res.status(200).json({ user });
      } else {
        res.status(422).json({ user });
      }
    }
    default: {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
}
