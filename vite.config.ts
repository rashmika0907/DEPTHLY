import { defineConfig, loadEnv } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [angular()],
    define: {
      // This exposes the API_KEY to your source code
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
