import { useState } from 'react';
import { Post } from './types';
import { fetchPost } from './posts';
import { useQuery } from './useQuery';

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      {children}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="post-card">
      <div className="post-card-content">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-body">{post.body}</p>
        <div className="post-footer">
          <div className="author-info">
            <div className="author-avatar">
              {post.id.toString()}
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(1);

  const { isPending, error, data } = useQuery<Post[], Error>({
    queryKey: `posts_page_${page}`,
    queryFn: () => fetchPost(page),
    cache: true,
    cacheTime: 5 * 60 * 1000,    
    staleTime: 10 * 1000,  
  });

  if (isPending) {
    return (
      <Container>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>게시글을 불러오는 중...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="error-message">
          <div className="error-content">
            <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="error-text">오류가 발생했습니다: {error.message}</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center">Post List</h1>
      
      {data?.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div className="pagination">
        <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="icon-button">
          <svg className="left-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="page-info">
          <span className="page-number">{page}</span>
          <span className="page-divider">/</span>
          <span className="page-total">10</span>
        </div>
        
        <button onClick={() => setPage(p => p + 1)} disabled={page >= 10} className="icon-button">
          <svg className="right-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Container>
  );
}

export default App;