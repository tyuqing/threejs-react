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
	ObjectLoader,
	Mesh,
} from 'three';
			import Stats from 'three/addons/libs/stats.module.js';
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
	let gltfList
	let stats, mixer, camera, scene, renderer, clock, controls;

	init()
	animate()

	function init() {

		//场景
		scene = new Scene();
		scene.background = new Color(0xf9f9fb);

		//光照
		const aLight = new AmbientLight(0x404040, 1);
		scene.add(aLight);
		const dLight = new DirectionalLight(0xffffff, 1);
		scene.add(dLight);

		//照相机
		camera = new PerspectiveCamera(45, r, 1, 1000000);
		//const camera = new THREE.OrthographicCamera(-s*r, s*r, s, -s, 1, 1000);
		camera.position.set(300, 200, 300);
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
		container?.current?.appendChild( stats.dom );
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
	// loaderObj({ objSrc: "/images/obj/server/uploads_files_2840457_server.obj", mtlSrc: '/images/obj/server/server.mtl' }, function (obj) {
	// 	scene.add(obj);
	// 	render();
	// })

	// index json绘制
	// var loader = new ObjectLoader();
	// loader.load('/images/gltf/server1/index.json', function(geometry, materials) {
	//   var mesh = new Mesh(geometry, materials);
	//   scene.add(mesh);
	// 		render()
	// 	});

	loaderGltf(
		{
			// gltfSrc: '/images/gltf/server/server.gltf',
			gltfSrc: '/images/gltf/server1/B706C5B30207178AE82438A46A375F70.gltf',
			scene: scene,
		},
		function ({model, animations}) {
			// if (animations && animations.length) {
			// 	  // debugger
			// 	   mixer = new AnimationMixer(model);
			// 		mixer.clipAction( animations[0] ).play();
			// 	}
		}
	);

	// 先手动绘制 
	function huizhi() {
		cabinets.forEach(element => {

			loaderGltf(
				{
					gltfSrc: '/images/gltf/server/server.gltf',
					scene: scene,
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

	function donghua() {
		console.log(gltfList)
	}

	return (<>
		<button onClick={() => huizhi()}>绘制</button>
		<button onClick={() => donghua()}>动画</button>
		<div ref={container}></div>
	</>);
}

export default JiFang;
