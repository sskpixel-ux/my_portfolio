export interface PortfolioImage {
  id: string;
  src: string;
  title: string;
  caption?: string;
}

export interface PortfolioAlbum {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  description: string;
  date?: string;
  location?: string;
  images: PortfolioImage[];
}
