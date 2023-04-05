import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static getConnect(request, response) {
    const authValue = request.header('Authorization');
    const encodedCredentials = authValue.split(' ')[1];
    const buff = Buffer.from(encodedCredentials, 'base64');
    const decodedCredentials = buff.toString('ascii');

    const [email, pwd] = decodedCredentials.split(':');

    if (!email || !pwd) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    return (async (userEmail, userPwd) => {
      const user = await dbClient.getUser({ email: userEmail, password: sha1(userPwd) });
      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, token, 86400);
      return response.status(200).json({ token });
    })(email, pwd);
  }
}

module.exports = AuthController;
