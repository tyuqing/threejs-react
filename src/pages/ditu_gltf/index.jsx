import { useEffect, useRef } from 'react';
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
	LoopOnce
} from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { loaderGltf, loaderObj } from '../../utils/loader';
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
		scene.background = new Color(0x000000);
		// scene.exposure = 1

		//光照
		const aLight = new AmbientLight(0x000000, 1); //080F20
		scene.add(aLight);
		
		const dLight = new DirectionalLight(0x999999, 1);
		dLight.position.set(0, 1, 0); // 设置光源位置在场景正上方
		dLight.target.position.set(0, 0, 0); // 设置光源照射的目标
		// scene.add(dLight);

		//照相机
		camera = new PerspectiveCamera(45, r, 1, 1000000);
		//const camera = new THREE.OrthographicCamera(-s*r, s*r, s, -s, 1, 1000);
		camera.position.set(10000, 20000, 30000);
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
		// renderer.setClearColor(0xffffff, 1);
		renderer.gammaOutput = false
renderer.setClearColor(0x000000, 0); // 设置清除色为黑,无雾效
renderer.shadowMap.enabled = false;
// 调低 gamma 值
renderer.gammaFactor = 0.5; 

// 禁用 gamma 纠正
renderer.gammaInput = false;
renderer.gammaOutput = false;

		//控制器
		controls = new OrbitControls(camera, renderer.domElement);
		controls.update();

		// 时间 用于动画
		clock = new Clock();
		// 性能分析
		stats = new Stats();

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


	loaderGltf(
		{
			// gltfSrc: '/images/gltf/server/server.gltf',
			gltfSrc: '/images/gltf/ditu/小地图.gltf',
			scene: scene,
		},
	);


	return (<>
		<div ref={container}></div>
	</>);
}

export default JiFang;
