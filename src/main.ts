import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { LmgLoader } from './utils/imageUtil'
// 这行代码务必放到 createApp 的上面,
// 保证当我们删除图片缓存,再刷新,执行完 createApp 就不再执行下面代码。
// 调用的时候把this硬绑定给类LmgLoader，确保类里的this指向正常
LmgLoader.storageAllImg.apply(LmgLoader) 

createApp(App).mount("#app");
