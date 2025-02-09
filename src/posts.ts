import { Post } from "./types";


export const fetchPost = async (page: number) => {
  if (page < 1 || page > 10) {
    throw new Error('페이지는 1과 10 사이여야 합니다.');
  }


  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
  
  if (!response.ok) {
    throw new Error('네트워크 오류가 발생했습니다!');
  }

  const data: Post[] = await response.json();
  return data;
};