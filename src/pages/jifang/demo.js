// 写一个方法 使用three创建指定大小和位置的墙壁是 表面用jpg的图片，墙壁内部指定位置嵌入门窗，门窗是gltf模型
const createWallWithDoorAndWindow = ({width, height, depth, position, doorPosition, windowPosition}) => {
  const texture = new THREE.TextureLoader().load('wall.jpg');
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const wall = new THREE.Mesh(geometry, material);
  wall.position.set(position.x, position.y, position.z);

  const doorLoader = new GLTFLoader();
  doorLoader.load('door.gltf', (gltf) => {
    const door = gltf.scene;
    door.position.set(doorPosition.x, doorPosition.y, doorPosition.z);
    wall.add(door);
  });

  const windowLoader = new GLTFLoader();
  windowLoader.load('window.gltf', (gltf) => {
    const window = gltf.scene;
    window.position.set(windowPosition.x, windowPosition.y, windowPosition.z);
    wall.add(window);
  });

  return wall;
}
