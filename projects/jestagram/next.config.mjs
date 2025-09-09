/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // GitHub 프로필 이미지
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
      // UploadThing 이미지 (v6.8.0 도메인)
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
      // UploadThing AWS S3 이미지 (백업)
      {
        protocol: "https",
        hostname: "uploadthing-prod.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
