
import { useEffect, useRef } from 'react';
import { Scene,DirectionalLight,PerspectiveCamera,WebGLRenderer } from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

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
			//const aLight = new THREE.AmbientLight(0x404040, 1);
			//scene.add(aLight);
			const dLight = new DirectionalLight(0xffffff, 1);
			scene.add(dLight);
			
			//照相机
			const camera = new PerspectiveCamera(75, r, 1, 1000);
			//const camera = new THREE.OrthographicCamera(-s*r, s*r, s, -s, 1, 1000);
			camera.position.set(300, 200, 300);
			camera.lookAt(scene.position);
			
			//辅助对象
			//const axis = new THREE.AxesHelper(300);
			//scene.add(axis);
			//const cHelper = new THREE.CameraHelper(camera);
			//scene.add(cHelper);
			
			//渲染器
			const renderer = new WebGLRenderer({
				antialias: true
			});
			renderer.setSize(w, h);
			renderer.setClearColor(0xffffff, 1);
			useEffect(() => {
				container?.current?.appendChild(renderer.domElement);
			},[container])
			
			//控制器
			// const ctrl = new OrbitControls(camera, renderer.domElement);
			
			//渲染函数
			function render() {
				//console.log("Render...");
				renderer.render(scene, camera);
				
				scene.rotation.y += 0.002;
				
				requestAnimationFrame(render);
			}
			
			//加载模型
			const loader = new OBJLoader();
			loader.load(
				"/images/obj/deer.obj",
				function(obj) {
					//console.log("Model: ", obj);
					obj.scale.set(0.33, 0.33, 0.33);
					obj.position.y = -250;
					scene.add(obj);
					render();
				},
				function(xhr) {
					//console.log("Loaded: ", (xhr.loaded / xhr.total * 100).toFixed(0), "%");
					
					

				},
				function(err) {
					console.error("Error: ", err);
				}
			);


  return ( <div ref={container}></div> );
}

export default JiFang;