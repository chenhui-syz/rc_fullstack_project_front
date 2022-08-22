import { defineConfig, CommonServerOptions } from "vite";
import vue from "@vitejs/plugin-vue";
// 如果想用es规范的import的方式去使用nodejs，需要加载对应的依赖库，否则会报错
// npm i @types/node --save-dev
// 安装之后就可以import引入使用fs了
import fs from "fs";
import dotenv, { DotenvParseOutput } from "dotenv";

// defineConfig的参数可以是一个对象，也可以是一个函数
export default defineConfig((mode) => {
  console.log("当前在什么环境运行项目:", mode.mode);

  //  拼接当前环境文件名
  const envFileName: string = ".env";
  const curEnvFileName = `${envFileName}.${mode.mode}`;
  console.log("curEnvFileName:", curEnvFileName);

  // fs.readFileSync：读取环境文件key-value数据到缓存对象。
  // dotenv.parse 读取缓存对象到envConf对象中。
  // dotenv的作用：将fs读取到的缓存对象解析成键值对的数据
  const envConf: DotenvParseOutput = dotenv.parse(
    fs.readFileSync(curEnvFileName)
  );
  console.log("我是环境变量配置，", envConf);

  const curEnv: string = mode.mode;
  // server这个名字是固定的
  let server: CommonServerOptions = {};
  if (curEnv === "development") {
    // 开发环境
    server = {
      // src下的declare_文件夹下myenv.d.ts文件中的DotenvParseOutput补充声明决定了这里可以借助ts的类型提示
      port: Number(envConf.VITE_PORT),
      host: envConf.VITE_HOST,
      // 代理转发，转发到后端后端
      proxy: {
        [envConf.VITE_BASE_URL]: {
          target: envConf.VITE_PROXY_DOMAIN,
        },
      },
    };
  } else if (curEnv === "production") {
    // 生产环境
    server = {
      port: Number(envConf.VITE_PORT),
      host: envConf.VITE_HOST,
    };
  }

  return {
    // 这个配置很关键，让vue和vite的建立连接
    plugins: [vue()],
  };
});
