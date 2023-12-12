import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/jifang", component: "jifang" },
    { path: "/louyu_obj", component: "louyu_obj" },
    { path: "/louyu_gltf", component: "louyu_gltf" },
    { path: "/ditu_gltf", component: "ditu_gltf" },
    { path: "/yuanqu_gltf", component: "yuanqu_gltf" },
    { path: "/wuhan", component: "wuhan" },
    { path: "/wuhan_obj", component: "wuhan_obj" },
  ],
  npmClient: 'npm',
});
