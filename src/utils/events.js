import { Raycaster, Vector2 } from 'three';
export function addSceneEvent(scene) {

  // 创建一个Raycaster对象，用于检测鼠标点击与模型的相交情况
  const raycaster = new Raycaster();

  // 给模型添加一个事件监听器，监听鼠标点击事件
  scene.addEventListener('click', function (event) {

    // 获取鼠标位置向量（归一化）
    const mouse = new Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // 设置Raycaster对象的相机和鼠标位置参数
    raycaster.setFromCamera(mouse, camera);

    // 获取与模型相交的部分（数组）
    const intersects = raycaster.intersectObjects(scene.children);

    // 如果数组非空，说明鼠标点击了模型
    if (intersects.length > 0) {

      // 获取第一个相交部分（object）
      const object = intersects[0].object;
      // 判断是否是机柜门（根据名称或其他属性）
      if (object.name === 'door') {

        // 创建一个AnimationMixer对象，用于创建和播放动画剪辑
        const mixer = new AnimationMixer(scene);

        // 创建一个动画数据对象，定义旋转角度和时间等参数（也可以从gltf文件中获取）
        const animation = {
          name: 'doorOpen',
          duration: 1,
          tracks: [
            {
              name: '.rotation[x]',
              type: 'number',
              times: [0, 1],
              values: [0, Math.PI / 2]
            }
          ]
        };

        // 调用clipAction方法，创建动画剪辑，并传入动画数据和目标对象作为参数
        const action = mixer.clipAction(animation, object);

        // 调用play方法，播放动画剪辑
        action.play();
      }
    }
  });
}