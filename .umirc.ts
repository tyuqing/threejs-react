import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/jifang", component: "jifang" },
    { path: "/louyu_obj", component: "louyu_obj" },
    { path: "/louyu_gltf", component: "louyu_gltf" },
    { path: "/ditu_gltf", component: "ditu_gltf" },
  ],
  npmClient: 'npm',
});
