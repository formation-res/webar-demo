import { defineConfig } from "vite";

export default defineConfig({
    server: {
        
        https: {
            key: './misc/webar-demo-privateKey.key',
            cert: './misc/webar-demo.crt',
        }
    }
})