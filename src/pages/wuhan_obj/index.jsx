import { useEffect, useRef } from 'react';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import {
	AmbientLight,
	AxesHelper,
	CameraHelper,
	Color,
	DirectionalLight,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	Clock,
	AnimationMixer,
	LoopOnce,
	TextureLoader,
	EquirectangularReflectionMapping,
	LightProbe,
	Background,
	PMREMGenerator,
	FloatType,
} from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { loaderObj } from '../../utils/loader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { cabinets } from '@/temp/jifang.js'
import { addSceneEvent } from '@/utils/events';

function JiFang() {
	const container = useRef(null);

	//全局变量
	const w = 1200;
	const h = 720;
	const r = w / h;
	const s = 330;
	let gltfList
	let stats, mixer, camera, scene, renderer, clock, controls;

	init()
	animate()

	function init() {

		//场景
		scene = new Scene();
		// scene.background = new Color(0x000000);

		// //光照
		// const aLight = new AmbientLight(0x9D9D9D, 1);
		// scene.add(aLight);
		// const dLight = new DirectionalLight(0xffffff, 1);
		// scene.add(dLight);

		//照相机
		camera = new PerspectiveCamera(45, r, 1, 1000000);
		//const camera = new THREE.OrthographicCamera(-s*r, s*r, s, -s, 1, 1000);
		camera.position.set(100, 200, 300);
		camera.lookAt(scene.position);

		//辅助对象 坐标
		const axis = new AxesHelper(300);
		scene.add(axis);
		const cHelper = new CameraHelper(camera);
		scene.add(cHelper);

		//渲染器
		renderer = new WebGLRenderer({
			antialias: true,
		});
		renderer.setSize(w, h);
		renderer.setClearColor(0xffffff, 1);


		//控制器
		controls = new OrbitControls(camera, renderer.domElement);
		controls.update();

		// 时间 用于动画
		clock = new Clock();
		// 性能分析
		stats = new Stats();


		// 创建一个PMREM生成器
		var pmremGenerator = new PMREMGenerator(renderer);
		pmremGenerator.compileEquirectangularShader();

		// 加载HDR图像
		var rgbeLoader = new RGBELoader();
		rgbeLoader.setDataType(FloatType);
		rgbeLoader.load('/images/hdr/sky.hdr', function (texture) {
			// 从HDR图像生成PMREM
			var envMap = pmremGenerator.fromEquirectangular(texture).texture;
			// 将PMREM作为场景的环境贴图
			scene.environment = envMap;
			// 将HDR图像作为场景的背景
			scene.background = envMap;
			// 释放资源
			texture.dispose();
			pmremGenerator.dispose();
		});
		// 创建光源
		const directionalLight = new DirectionalLight(0xffffff, 1);
		// directionalLight.color.setHSL(0.1, 1, 0.95);
		// directionalLight.position.set(- 1, 1.75, 1);
		directionalLight.position.set(0, 100, 500);
		scene.add(directionalLight);

	}


	// useEffect(() => {
	// 	addSceneEvent(scene)
	// }, [scene])

	// 插入dom
	useEffect(() => {
		container?.current?.appendChild(renderer.domElement);
		container?.current?.appendChild(stats.dom);
	}, [container]);


	// const ctrl = new OrbitControls(camera, renderer.domElement);

	//渲染函数
	function render() {
		renderer.render(scene, camera);

	}
	function animate() {
		requestAnimationFrame(animate)
		// controls.update()

		if (mixer) {
			console.log('donghua')
			mixer.update(clock.getDelta());
		}
		//  一直旋转
		// 	scene.rotation.y += 0.002;
		render()
		stats.update()
	}

	//加载模型
	loaderObj({ objSrc: "/images/obj/wuhan/wuhan.obj", mtlSrc: '/images/obj/wuhan/wuhan.mtl' }, function (obj) {
		scene.add(obj);
		render();
	})


	function donghua() {
		console.log(gltfList)
	}

	return (<>
		<button onClick={() => donghua()}>动画</button>
		<div ref={container}></div>
	</>);
}

export default JiFang;
