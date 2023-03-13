import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

/**
 * 载入obj模型
 */
export function loaderObj({objSrc, mtlSrc} = {}, callback) {

	// 创建loader
	const objLoad = new OBJLoader();
	const mtlLoader = new MTLLoader();

  
	mtlLoader.load(
		// mtl文件的路径 
		mtlSrc,
		// 回调函数，参数是材质对象 
		function (materials) {
			materials.preload()
			objLoad
				.setMaterials(materials)
				.load(
					objSrc,
					function (obj) {
						console.log("Model: ", obj);
						obj.scale.set(150, 150, 150);
						obj.position.y = 0;
            callback && callback(obj)
					},
					function (xhr) {
						console.log("Loaded: ", xhr);
					},
					function (err) {
						console.error("Error: ", err);
					}
				);
		})
}