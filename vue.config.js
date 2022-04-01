const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        electronBuilder: {
            externals: ['robotjs', 'ffi-napi', 'ref-napi', 'win32-api'],
            nodeIntegration: true,
            customFileProtocol: "./",
            builderOptions: {
                "productName": "浪漫庄园物价网",
                "files": [
                    "!dist/**/*"
                ],
                "win": {
                    "target": [
                        {
                            "target": "nsis",
                            "arch": [
                                "ia32",
                                // "x64"
                            ]
                        }
                    ]
                },
                "extends": null,
            },
        }
    },
});
