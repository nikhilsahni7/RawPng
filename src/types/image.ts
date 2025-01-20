export interface ImageDetails {
  _id: string;
  title: string;
  description: string;
  category: string;
  cloudFrontUrl: string;
  fileType: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  uploadDate: string;
  downloads: number;
  keywords: string[];
  license: string;
  author: string;
}
