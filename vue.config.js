const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // List native deps here if they don't work
      externals: ['electron'],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ['./node_modules'],
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: "RGB-PC",
        win: {
          icon: "./rgb.ico",
          target: [
            {
              target: "nsis",
              arch: [
                "x64",
                "ia32"
              ]
            },
            {
              target: "zip",
              arch: [
                "x64",
                "ia32"
              ]
            }
          ]
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          installerIcon: "./rgb.ico"
        }
      }
    }
  }
})
