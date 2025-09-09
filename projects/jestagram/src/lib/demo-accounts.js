// lib/demo-accounts.js
export const DEMO_ACCOUNTS = [
  {
    id: "demo-user-1",
    name: "김민수",
    email: "demo1@example.com",
    image: "/demo-avatars/user1.jpg",
    bio: "사진을 좋아하는 개발자입니다 📸",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "demo-user-2",
    name: "이지은",
    email: "demo2@example.com",
    image: "/demo-avatars/user2.jpg",
    bio: "여행과 맛집을 기록하는 일상 블로거 ✈️",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "demo-user-3",
    name: "박서준",
    email: "demo3@example.com",
    image: "/demo-avatars/user3.jpg",
    bio: "운동과 건강을 추구하는 개발자 💪",
    createdAt: new Date("2024-03-10"),
  },
];

export const DEMO_POSTS = [
  {
    id: "demo-post-1",
    caption: "오늘의 맛집 발견! #맛집 #일상 #데이트",
    imageUrl: "/demo-images/post1.jpg",
    authorId: "demo-user-1",
    createdAt: new Date("2025-09-01"),
  },
  {
    id: "demo-post-2",
    caption: "여행 중 찍은 사진 📸 #여행 #바다 #휴가",
    imageUrl: "/demo-images/post2.jpg",
    authorId: "demo-user-2",
    createdAt: new Date("2025-09-02"),
  },
  {
    id: "demo-post-3",
    caption: "운동 후 기분 좋은 하루! #운동 #건강 #일상",
    imageUrl: "/demo-images/post3.jpg",
    authorId: "demo-user-3",
    createdAt: new Date("2025-09-03"),
  },
];

export const DEMO_COMMENTS = [
  {
    id: "demo-comment-1",
    content: "와 맛있어 보이네요! 어디인가요?",
    authorId: "demo-user-2",
    postId: "demo-post-1",
    createdAt: new Date("2025-09-01"),
  },
  {
    id: "demo-comment-2",
    content: "저도 가보고 싶어요!",
    authorId: "demo-user-3",
    postId: "demo-post-1",
    createdAt: new Date("2025-09-02"),
  },
];

export const DEMO_FOLLOWS = [
  { followerId: "demo-user-1", followingId: "demo-user-2" },
  { followerId: "demo-user-2", followingId: "demo-user-3" },
  { followerId: "demo-user-3", followingId: "demo-user-1" },
];
