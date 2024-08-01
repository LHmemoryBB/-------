import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy, getBuildTime } from './build/config';

export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;
  console.log(createViteProxy(viteEnv, configEnv.command === 'serve'));
  
  const buildTime = getBuildTime();

  return {
    // base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        }
      }
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    server: {
      host: '0.0.0.0',
      port: 9527,
      open: true,
      proxy: {
				"/api": {
					// target: 'http://ht.pay19.cn/api', // 本地
					//target: 'http://2dxgeu.natappfree.cc/api', // 测试、
					target: 'http://123.60.59.192:62493/api',
					//target: 'http://ht.pay19.cn/api', //测试吉
					//target: 'http://vip.11qy.cn/api', // 正式
					changeOrigin: true,
					secure: false, // 如果是https接口，需要配置这个参数
					ws: true, //websocket支持
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
				"/VerificationCode": {
					// target: 'http://vip.11qy.cn/', // 正式
					//target: 'http://2dxgeu.natappfree.cc/',
					target: 'http://123.60.59.192:62493/',
					//target: 'http://ht.pay19.cn/', //测试吉
					// target: 'http://ht.pay19.cn/',
					changeOrigin: true,
					secure: false, // 如果是https接口，需要配置这个参数
					ws: true, //websocket支持
					rewrite: (path) => path.replace(/^\/VerificationCode/, ""),
				},
			},
      fs: {
        cachedChecks: false
      },
      
    },
    preview: {
      port: 9725
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  };
});
