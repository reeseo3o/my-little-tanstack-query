# My Little TanStack Query

## 소개

이 프로젝트는 TanStack Query(React Query)의 내부 동작 원리를 이해하기 위해 핵심 기능들을 직접 구현한 학습용 레포지토리입니다. 복잡한 라이브러리의 동작 방식을 간소화된 버전으로 재현하여 개념을 명확히 이해할 수 있도록 도와줍니다.

## 블로그 글을 위한 예제 코드

이 프로젝트는 다음 블로그 포스트의 예제 코드입니다.
- [React Query 직접 구현하면서 이해하기](https://www.reese-log.com/tanstack-query-internals-and-implementation)
- [useQuery에 staleTime 구현하기: stale-while-revalidate 패턴 톺아보기](https://www.reese-log.com/usequery-staletime-and-swr)

## 설치 및 실행 방법

```bash
# 저장소 클론
git clone https://github.com/yourusername/my-little-tanstack-query.git
cd my-little-tanstack-query

# 의존성 설치
npm install
# 또는
yarn install
# 또는
pnpm install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
# 또는
pnpm run dev
```

## 주요 기능
- **caching**: 데이터 캐싱 및 캐시 만료 관리
- **staleTime**: 데이터 신선도 관리
- **retry**: 실패한 요청에 대한 재시도 로직

##  학습 포인트

React Query의 핵심 개념
   - staleTime vs cacheTime
   - Stale-While-Revalidate 패턴
   - 캐싱 전략

성능 최적화
   - 캐시 관리
   - 불필요한 네트워크 요청 방지
   - Race condition 처리