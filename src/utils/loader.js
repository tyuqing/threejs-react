import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

/**
 * 载入obj模型
 */
export function loaderObj({ objSrc, mtlSrc } = {}, callback) {
  // 创建loader
  const objLoad = new OBJLoader();
  const mtlLoader = new MTLLoader();

  mtlLoader.load(
    // mtl文件的路径
    mtlSrc,
    // 回调函数，参数是材质对象
    function (materials) {
      materials.preload();
      objLoad.setMaterials(materials).load(
        objSrc,
        function (obj) {
          console.log('Model: ', obj);
          obj.scale.set(150, 150, 150);
          obj.position.y = 0;
          callback && callback(obj);
        },
        function (xhr) {
          console.log('Loaded: ', xhr);
        },
        function (err) {
          console.error('Error: ', err);
        }
      );
    }
  );
}

export function loaderGltf({ gltfSrc, mtlSrc } = {}, callback) {
  // 创建loader
  const gltfLoad = new GLTFLoader();
  const mtlLoader = new MTLLoader();

  // 加载gltf文件
  gltfLoad.load(
    // 文件路径
    gltfSrc,
    // 回调函数
    function (gltf) {
      console.log(gltf);
      // 获取返回的gltf对象
      var model = gltf.scene;
      var animations = gltf.animations;
      model.scale.set(100, 100, 100);
      model.position.y = 0;

      // 将模型添加到场景中
      callback && callback(model);

      // 如果有动画，创建一个AnimationMixer对象，并将动画添加到它里面
      if (animations && animations.length) {
        mixer = new AnimationMixer(model);
        for (var i = 0; i < animations.length; i++) {
          mixer.clipAction(animations[i]).play();
        }
      }
    },
    // 可选的进度回调函数
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    // 可选的错误回调函数
    function (error) {
      console.log('An error happened');
    }
  );
}
