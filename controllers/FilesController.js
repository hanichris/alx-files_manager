import { mkdir, writeFile } from 'fs';
import { ObjectID } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
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

    const { isPublic = false } = request.body;
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
    const { parentId = 0 } = request.body;
    if (parentId) {
      const file = await dbClient.getFile({ parentId: new ObjectID(parentId) });
      if (!file) {
        return response.status(400).json({ error: 'Parent not found' });
      }
      if (file.type !== 'folder') {
        return response.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const saveFile = {
      userId: user._id,
      name,
      type,
      isPublic,
      parentId: parentId === 0 ? '0' : new ObjectID(parentId),
    };

    if (type === 'folder') {
      try {
        const resultId = await dbClient.createFile(saveFile);
        saveFile.id = resultId;
        saveFile.userId = user._id.toString();
        saveFile.parentId = saveFile.parentId === '0' ? 0 : saveFile.parentId.toString();
        delete saveFile._id;
        return response.status(201).json(saveFile);
      } catch (e) {
        console.error(e.message);
        return response.status(500).json({ msg: 'Internal server error occured.' });
      }
    }
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const filePath = `${folderPath}/${uuidv4()}`;
    const buff = Buffer.from(data, 'base64');
    mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        writeFile(filePath, buff, (err) => {
          if (err) {
            console.error(err.message);
          }
        });
      }
    });
    saveFile.localPath = folderPath;
    try {
      const resultId = await dbClient.createFile(saveFile);
      delete saveFile.localPath;
      saveFile.id = resultId;
      saveFile.userId = user._id.toString();
      saveFile.parentId = saveFile.parentId === '0' ? 0 : saveFile.parentId.toString();
    } catch (e) {
      console.error(e.message);
      return response.status(500).json({ msg: 'Internal server error occured.' });
    }
    delete saveFile._id;
    return response.status(201).json(saveFile);
  }
}

module.exports = FilesController;
