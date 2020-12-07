import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpDirectory, file),
      path.resolve(uploadConfig.uploadsDirectory, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsDirectory, file);
    if (filePath) {
      try {
        fs.promises.stat(filePath);
      } catch {
        return;
      }
      fs.promises.unlink(filePath);
    }
  }
}
