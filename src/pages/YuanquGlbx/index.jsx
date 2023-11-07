import React from 'react';
import BabylonScene from '@/components/BabylonScene';

// 定义一个React页面，使用BabylonScene组件展示一个.glb模型
// /images/glb/标识1.glb
// /images/glb/园区07_1682041003987.glbx
// /images/gltf/yuanqu/园区.gltf
export default  () => {
  // 定义一个.glb文件的URL，可以是本地或远程的
  const glbUrl = "/images/gltf/yuanqu/园区.gltf";

  // 返回一个包含BabylonScene组件的div元素，可以设置样式或类名等属性
  return (
    <div>
      <BabylonScene glbUrl={glbUrl} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
