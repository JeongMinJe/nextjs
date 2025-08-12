// 데이터베이스 시드 스크립트
// 개발과 테스트를 위한 샘플 데이터를 생성합니다

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('시드 데이터 생성 시작...')

  // 테스트용 샘플 이미지 URLs (무료 이미지 서비스)
  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517817748493-49ec54a32465?w=600&h=600&fit=crop',
  ]

  const sampleCaptions = [
    '아름다운 하루였습니다! 🌅',
    '친구들과 함께한 즐거운 시간 ✨',
    '오늘의 풍경이 너무 예뻐서 📸',
    '맛있는 음식과 함께하는 저녁 🍽️',
    '새로운 도전을 시작했어요! 💪',
    '평화로운 순간들 🕊️',
    '자연 속에서 힐링하는 중 🌿',
    '소중한 추억을 남기며 💝'
  ]

  // 현재 로그인한 사용자들 조회
  const users = await prisma.user.findMany()
  
  if (users.length === 0) {
    console.log('⚠️ 사용자가 없습니다. 먼저 로그인을 해주세요.')
    return
  }

  // 각 사용자마다 2-3개의 게시글 생성
  for (const user of users) {
    const postCount = Math.floor(Math.random() * 2) + 2 // 2-3개

    for (let i = 0; i < postCount; i++) {
      const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]
      const randomCaption = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)]
      
      // 과거 시간으로 설정 (최근 7일 이내)
      const createdAt = new Date()
      createdAt.setTime(createdAt.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)

      await prisma.post.create({
        data: {
          caption: randomCaption,
          imageUrl: randomImage,
          authorId: user.id,
          createdAt: createdAt,
        }
      })

      console.log(`✅ ${user.name}의 게시글 생성됨`)
    }
  }

  const totalPosts = await prisma.post.count()
  console.log(`🎉 시드 데이터 생성 완료! 총 ${totalPosts}개의 게시글이 생성되었습니다.`)
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 오류:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })