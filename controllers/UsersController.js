import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static postNew(request, response) {
    const { email } = request.body;
    const { password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    return (async (userEmail, pwd) => {
      let _id;
      try {
        const user = await dbClient.getUserByEmail(email);
        if (user) {
          return response.status(400).json({ error: 'Already exist' });
        }
        _id = await dbClient.createUser({ email: userEmail, password: sha1(pwd) });
      } catch (error) {
        console.error(`Following error occurred: ${error}`);
      }
      return response.status(200).json({ id: _id, email: userEmail });
    })(email, password);
  }
}

module.exports = UsersController;
