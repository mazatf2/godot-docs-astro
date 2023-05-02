import {defineConfig} from 'astro/config';
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

process.on('uncaughtException', err => {
	console.error(err, 'Uncaught Exception thrown')
})

// https://astro.build/config
export default defineConfig({
	integrations: [react(), mdx()],
	ssr: {
		external: ['water.css']
	}
});