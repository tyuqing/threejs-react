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
} from 'three';
import { loaderGltf } from '../../utils/loader';
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

	//场景
	const scene = new Scene();
	scene.background = new Color(0x666666);

	//光照
	const aLight = new AmbientLight(0x404040, 1);
	scene.add(aLight);
	const dLight = new DirectionalLight(0xffffff, 1);
	scene.add(dLight);

	//照相机
	const camera = new PerspectiveCamera(45, r, 1, 1000000);
	//const camera = new THREE.OrthographicCamera(-s*r, s*r, s, -s, 1, 1000);
	camera.position.set(300, 200, 300);
	camera.lookAt(scene.position);

	//辅助对象 坐标
	const axis = new AxesHelper(300);
	scene.add(axis);
	const cHelper = new CameraHelper(camera);
	scene.add(cHelper);

	//渲染器
	const renderer = new WebGLRenderer({
		antialias: true,
	});
	renderer.setSize(w, h);
	renderer.setClearColor(0xffffff, 1);


	//控制器
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.update();


	useEffect(() => {
		addSceneEvent(scene)
	}, [scene])

	// 插入dom
	useEffect(() => {
		container?.current?.appendChild(renderer.domElement);
	}, [container]);


	// const ctrl = new OrbitControls(camera, renderer.domElement);

	//渲染函数
	function render() {
		//console.log("Render...");
		renderer.render(scene, camera);

	}
	function animate() {
		requestAnimationFrame(animate)
		controls.update()
		render()
		// stats.update()
	}
	// 一直旋转
	// function animate() {
	// 	requestAnimationFrame(animate)
	// 	//  一直旋转
	// 	scene.rotation.y += 0.002;
	// 	render()
	// }

	animate()
	//加载模型
	// loaderObj({ objSrc: "/images/obj/server/uploads_files_2840457_server.obj", mtlSrc: '/images/obj/server/server.mtl' }, function (obj) {
	// 	scene.add(obj);
	// 	render();
	// })
	// 
	// 先手动绘制 
	function huizhi() {
		cabinets.forEach(element => {

			loaderGltf(
				{
					gltfSrc: '/images/gltf/server/server.gltf',
					position: {
						x: element.cabinets3DView.positionX,
						z: element.cabinets3DView.positionZ,
					},
					rotate: {
						y: element.cabinets3DView.rotateY
					}
				},
				function (model) {
					scene.add(model);
					addSceneEvent(scene)
					render();
				}
			);
		});
	}

	return (<>
		<button onClick={() => huizhi()}>绘制</button>
		<div ref={container}></div>
	</>);
}

export default JiFang;
