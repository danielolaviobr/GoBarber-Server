import ICacheProvider from '../models/iCacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cacheData: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cacheData[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cacheData[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cacheData[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cacheData).filter(key =>
      key.startsWith(`${prefix}:`),
    );
    keys.forEach(key => {
      delete this.cacheData[key];
    });
  }
}
