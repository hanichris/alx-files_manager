import sha1 from 'sha1';
import dbClient from '../utils/db';

class AuthController {
  static getConnect(request, response) {
    const authValue = request.header('Authorization');
    const encodedCredentials = authValue.split(' ')[1];
    const buff = new Buffer(encodedCredentials, 'base64');
    const decodedCredentials = buff.toString('ascii');

    const [ email, pwd ] = decodedCredentials.split(':');

    if (!email || !pwd) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    return (async (userEmail, userPwd) => {
      const user = await dbClient.getUser({ email: userEmail, password: sha1(userPwd) });
      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      return response.status(200).json({ msg: `Found user with id: ${user.email}`});
    })(email, pwd);
  }
}

module.exports = AuthController;
