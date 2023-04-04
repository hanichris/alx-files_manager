import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static postNew(request, response) {
    const email = request.body.email;
    const password = request.body.password;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    (async (userEmail, pwd) => {
      const user = await dbClient.getUserByEmail(email);
      if (user) {
        return response.status(400).json({ error: 'Already exist' });
      } else {
        try {
          const _id = await dbClient.createUser({email: userEmail, password: sha1(pwd)});
          return response.status(200).json({ id: _id, email: userEmail});
        } catch (error) {
          console.error(`Following error occurred: ${error}`);
        }
      }
    })(email, password);
  }
}

module.exports = UsersController;
