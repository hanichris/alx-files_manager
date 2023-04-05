import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const user = await dbClient.getUser({ _id: new ObjectID(userId) });
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { isPublic } = request.body ?? false;
    const { name } = request.body;
    if (!name) {
      return response.status(400).json({ error: 'Missing name' });
    }
    const { type } = request.body;
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return response.status(400).json({ error: 'Missing type' });
    }
    const { data } = request.body;
    if (!data && type !== 'folder') {
      return response.status(400).json({ error: 'Missing data' });
    }
    const { parentId } = request.body ?? 0;
    if (parentId) {
      const file = await dbClient.getFile({ parentId: new ObjectID(parentId) });
      if (!file) {
        return response.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return response.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    if (type === 'folder') {
      const saveFile = {
        userId: user._id.toString(),
        name,
        type,
        isPublic,
        parentId: ObjectID.isValid(parentId) ? new ObjectID(parentId) : 0,
      };
      try {
        const id = await dbClient.createFile(saveFile);
        saveFile._id = id;
        return response.status(201).json(saveFile);
      } catch (error) {
        console.error(`Error: ${error}`);
        return response.status(500).json({msg: 'Internal server error occured.'});
      }
    }
  }
}

module.exports = FilesController;
