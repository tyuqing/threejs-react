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

		//光照
		const aLight = new AmbientLight(0x000000, 1);
		scene.add(aLight);
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
			gltfSrc: '/images/gltf/faguanglou/发光的楼.gltf',
			scene: scene,
		},
	);


	return (<>
		<div ref={container}></div>
	</>);
}

export default JiFang;
