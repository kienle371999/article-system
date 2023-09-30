interface Source {
  name: string;
  url: string;
}

export interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
  source: Source;
}

export interface News {
  totalArticles: number;
  articles: Article[];
}
