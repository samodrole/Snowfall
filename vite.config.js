import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Separate dependencies from node_modules into specific vendor chunks
					if (id.includes('node_modules')) {
						if (id.includes('d3')) return 'vendor_d3';
						if (id.includes('lodash')) return 'vendor_lodash';
						return 'vendor';
					}

					// Separate specific feature or page-related chunks
					if (id.includes('/src/routes/BarChart')) return 'barChart';
					if (id.includes('/src/routes/LineChart')) return 'lineChart';
					if (id.includes('/src/routes/ScatterPlot')) return 'scatterPlot';

					// General utilities chunk
					if (id.includes('/src/utils/')) return 'utils';
				}
			}
		}
	}
});
