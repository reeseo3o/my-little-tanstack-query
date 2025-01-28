export type Post = {
    id: number;
    title: string;
    body: string;
    author: {
      name: string;
      email: string;
    };
  };