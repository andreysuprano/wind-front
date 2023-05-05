/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		BASE_URL: process.env.BASE_URL
	},
	images: {
		formats: [ 'image/avif', 'image/webp' ],
		domains: [ 'firebasestorage.googleapis.com', 'site-vofstudio.appspot.com' ]
	}
};
module.exports = nextConfig;
