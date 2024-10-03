export interface IRedisService {
    set(
      key: string,
      value: any,
      keyType?: string,
      expiry?: number,
    ): Promise<void>;
  
    get(
      key: string,
      keyType?: string,
      pagination?: { page: number; limit: number },
    ): Promise<any>;
  
    delete(key: string, keyType?: string): Promise<void>;
  
    clearAllCache(): Promise<void>;
  }
  