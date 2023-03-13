
import { useEffect, useRef } from 'react';
import {
	Scene, DirectionalLight, PerspectiveCamera, WebGLRenderer, AxesHelper,
	CameraHelper, AmbientLight
} from 'three';
import { loaderObj } from '@/utils/loader';

function JiFang() {

	const container = useRef(null)

	//全局变量
	const w = 800;
	const h = 480;
	const r = w / h;
	const s = 330;

	//场景
	const scene = new Scene();
	//scene.background = new THREE.Color(0x666666);

	//光照
	const aLight = new AmbientLight(0x404040, 1);
	scene.add(aLight);
	const dLight = new DirectionalLight(0xffffff, 1);
	scene.add(dLight);

	//照相机
	const camera = new PerspectiveCamera(75, r, 1, 1000);
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
		antialias: true
	});
	renderer.setSize(w, h);
	renderer.setClearColor(0xffffff, 1);
	useEffect(() => {
		container?.current?.appendChild(renderer.domElement);
	}, [container])

	//控制器
	// const ctrl = new OrbitControls(camera, renderer.domElement);

	//渲染函数
	function render() {
		//console.log("Render...");
		renderer.render(scene, camera);

		//  一直旋转
		scene.rotation.y += 0.002;

		requestAnimationFrame(render);
	}

	//加载模型
		loaderObj({objSrc:"/images/obj/server/uploads_files_2840457_server.obj", mtlSrc:'/images/obj/server/server.mtl'}, function(obj) {
			scene.add(obj);
			render();
		})

	return (<div ref={container}></div>);
}

export default JiFang;