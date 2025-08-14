// UploadThing API 라우트 핸들러
// 서버 전용 설정만 import합니다

import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "@/lib/uploadthing-server"  // 경로 변경

const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})

export { GET, POST }