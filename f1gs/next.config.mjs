/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ijyukfavmkdbrwgzcegw.supabase.co",
                pathname: "/storage/v1/object/public/board_member_images/*"
            },
            {
                protocol: "https",
                hostname: "ijyukfavmkdbrwgzcegw.supabase.co",
                pathname: "/storage/v1/object/public/events_images/*"
            }
        ]
    }
};

export default nextConfig;
