export interface ModelData {
  id: string;
  name: string;
  contextLength: number;
  inputPrice: number;
  outputPrice: number;
  inputCacheReadPrice?: number;
  inputCacheWritePrice?: number;
  inputModalities: string[];
  outputModalities: string[];
  provider: string;
  createdAt?: number;
}
