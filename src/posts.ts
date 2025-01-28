import { Post } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DUMMY_POSTS: Post[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `게시글 ${i + 1}`,
  body: `이것은 게시글 ${i + 1}의 내용입니다. 더미 데이터로 생성된 컨텐츠입니다.`,
  author: {
    name: `작성자${i + 1}`,
    email: `author${i + 1}@example.com`
  }
}));

export const fetchPost = async (page: number) => {
  if (page < 1 || page > 10) {
    throw new Error('페이지는 1과 10 사이여야 합니다.');
  }
  
  await sleep(800); // 실제 API 호출처럼 지연시간 추가
  
  // 30% 확률로 에러 발생
  if (Math.random() < 0.3) {
    throw new Error('네트워크 오류가 발생했습니다!');
  }

  const startIndex = (page - 1) * 5;
  return DUMMY_POSTS.slice(startIndex, startIndex + 5);
};