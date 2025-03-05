export interface Panelist {
  id: string;
  name: string;
  position?: string;
  batch?: string;
  stream?: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  order?: number;
}
