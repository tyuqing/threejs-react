import React, { useEffect, useRef } from "react";
import { Engine, Scene, SceneLoader, StandardMaterial, Color3, Mesh, FreeCamera, Vector3, HemisphericLight } from "babylonjs";

// 定义一个自定义的React组件，用于加载和展示Babylonjs场景
export default ({ glbUrl, ...rest }) => {
  const canvasRef = useRef(null); // 获取canvas的引用
  const sceneRef = useRef(null); // 获取场景的引用

  // 使用useEffect在组件挂载时创建和启动Babylonjs引擎和场景
  useEffect(() => {
    const { current: canvas } = canvasRef; // 获取canvas元素
    if (!canvas) return; // 如果没有canvas，直接返回
    const engine = new Engine(canvas, true); // 创建一个新的Babylonjs引擎
    const scene = new Scene(engine); // 创建一个新的Babylonjs场景
    scene.clearColor = Color3.Blue(); // 设置场景的背景颜色为黑色
    sceneRef.current = scene; // 保存场景的引用

    // 使用LoadAssetContainer方法加载.glb文件，并在场景中实例化模型
    SceneLoader.LoadAssetContainer(glbUrl, "", scene, (container) => {
      container.instantiateModelsToScene();
      const meshes = container.meshes; // 获取加载的网格数组
      const material = new StandardMaterial("material", scene); // 创建一个标准材质
      material.diffuseColor = Color3.Red(); // 设置材质的漫反射颜色为红色
      material.backFaceCulling = false; // 关闭背面剔除
      const model = Mesh.MergeMeshes(meshes, true, true, undefined, false, true); // 合并网格为一个模型
      model.material = material; // 给模型应用材质
      model.scaling = new Vector3(0.5, 0.5, 0.5); // 设置模型的缩放比例为0.5
      model.layerMask = 2; // 设置模型的层遮罩为2
    });

    // 创建一个自由相机，并设置其位置和目标
    const camera = new FreeCamera("camera", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());

    // 创建一个半球光，并设置其强度和方向
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // 让引擎在每一帧渲染场景
    engine.runRenderLoop(() => {
      scene.render();
    });

    // 当窗口大小改变时，调整引擎的大小
    const resize = () => {
      scene.getEngine().resize();
    };
    if (window) {
      window.addEventListener("resize", resize);
    }

    // 在组件卸载时，释放引擎和场景的资源，并移除窗口的事件监听器
    return () => {
      scene.getEngine().dispose();
      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [glbUrl]); // 如果glbUrl发生变化，重新执行useEffect

  // 返回一个canvas元素，用于渲染Babylonjs场景
  return <canvas ref={canvasRef} {...rest} />;
};