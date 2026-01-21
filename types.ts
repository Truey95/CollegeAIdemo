
export enum AspectRatio {
  RATIO_1_1 = '1:1',
  RATIO_2_3 = '2:3',
  RATIO_3_2 = '3:2',
  RATIO_3_4 = '3:4',
  RATIO_4_3 = '4:3',
  RATIO_9_16 = '9:16',
  RATIO_16_9 = '16:9',
  RATIO_21_9 = '21:9'
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}
