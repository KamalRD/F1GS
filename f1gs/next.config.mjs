/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ijyukfavmkdbrwgzcegw.supabase.co",
                pathname: "/storage/v1/object/public/board_member_images/*"
            }
        ]
    }
};

export default nextConfig;
