# Next.js 15 & App Router 핵심 기능 스터디

Udemy 강의 플랫폼에서 Maximilian Schwarzmüller 강사의 Next.js 15 강의를 통해
Next.js의 앱 라우터(App Router) 주요 기능을 학습하며 만든 음식 레시피 공유 프로젝트입니다.

## 🚀 핵심 기술 및 학습 내용

- **App Router**: `app` 디렉터리 기반의 파일 시스템 라우팅 (`page`, `layout`, `error` 등)
- **Rendering**: 서버 컴포넌트(기본)와 `"use client"`를 통한 클라이언트 컴포넌트의 역할 구분
- **Data Handling**: `async/await` 직접 호출 및 `"use server"`를 활용한 **Server Actions** 구현
- **State Management**: `useFormState`, `useFormStatus`를 이용한 Form 상태 관리
- **Caching**: 공격적인 캐싱 정책과 **`revalidatePath`**를 통한 데이터 재검증

## ⚠️ 주요 고려사항

Next.js의 캐싱 정책으로 인해 개발과 배포 환경의 동작이 다를 수 있으며, **`revalidatePath`**를 통한 데이터 재검증이 필수적입니다. 또한, 본 프로젝트의 이미지 업로드는 `public` 폴더를 사용하나, 실제 배포 환경에서는 유실될 수 있으므로 **S3와 같은 외부 스토리지 연동이 필요합니다.**

## 🛠️ 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 및 실행
npm run build
npm start
```
