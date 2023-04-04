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

    return response.status(200).json({ msg: 'Success!!!'});
  }
}

module.exports = UsersController;
