import storage from "good-storage";
export class LmgLoader {
  // static定义静态方法，这些方法都没有必要在外部使用
  static imglist: Record<string, any> = {};

  // 存储所有图片到本地缓存
  static storageAllImg() {
    this.imglist = storage.get("imglist") || {};
    if (!LmgLoader.imglist || !LmgLoader.isNotEmptyImgList()) {
      LmgLoader.imglist = LmgLoader.loadAllImg();
      storage.set("imglist", LmgLoader.imglist);
    }
  }

  static isNotEmptyImgList() {
    return Object.getOwnPropertyNames(LmgLoader.imglist).length;
  }

  // 根据图片名获取图片。
//   getImg函数里面不能存在this
  static getImg(imgName: string): string {
    LmgLoader.imglist = LmgLoader.isNotEmptyImgList()
      ? LmgLoader.imglist
      : storage.get("imglist");
    return LmgLoader.imglist[imgName];
  }

  // 加载所有图片到内存。
  static loadAllImg(): any {
    let imgList: any = {};
    // **代表一级或更深入多级的目录
    const viewImgModules: any = import.meta.globEager(
      `../assets/img/**/*.png`
    );
    for (let path in viewImgModules) {
      let imgFullPath = viewImgModules[path].default;
      // 取得文件名，并结合成文件名+绝对路径的键值对
      if (imgFullPath) {
        let imgName = path.substring(path.lastIndexOf("/") + 1);
        imgList[imgName] = imgFullPath;
      }
    }
    return imgList;
  }
}

// 单独导出这个方法，调用的时候更方便
// getImg函数不能使用this，因为这个函数是导出去单独使用的，调用对象已经没法保持住是LmgLoader了，调用对象是调用这个getImg方法的组件对象
export default LmgLoader.getImg;
