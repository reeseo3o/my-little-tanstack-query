# My Little TanStack Query

React Query의 핵심 기능들을 직접 구현해보면서 이해하는 프로젝트입니다. 특히 staleTime과 Stale-While-Revalidate 패턴의 동작 방식을 실제 코드로 구현하여 학습할 수 있습니다.


##  블로그 글을 위한 예제 코드

이 프로젝트는 다음 블로그 포스트의 예제 코드입니다.
- [React Query 직접 구현하면서 이해하기](https://www.reese-log.com/tanstack-query-internals-and-implementation)
- React Query의 staleTime과 Stale-While-Revalidate 패턴 이해하기

##  주요 기능

- **caching**: 데이터 캐싱 및 캐시 만료 관리
- **staleTime**: 데이터 신선도 관리
- **Stale-While-Revalidate**: 백그라운드 데이터 갱신
- **retry**: 실패한 요청에 대한 재시도 로직
- **Race Condition 방지**: 동시 요청 처리

##  학습 포인트

1. React Query의 핵심 개념
   - staleTime vs cacheTime
   - Stale-While-Revalidate 패턴
   - 캐싱 전략

2. React 훅 구현
   - 커스텀 훅 설계
   - 타입스크립트 타입 설계
   - 사이드 이펙트 관리

3. 성능 최적화
   - 캐시 관리
   - 불필요한 네트워크 요청 방지
   - Race condition 처리
