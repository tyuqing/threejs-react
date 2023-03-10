import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/jifang", component: "jifang" },
  ],
  npmClient: 'npm',
});
