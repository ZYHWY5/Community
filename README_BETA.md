# Nuxt3 技术栈规范

## 目录结构规范

BETA 版使用规范
1、不允许把BETA版本merge到任何其他分支
2、BETA 内容只能从BETA 分支克隆子分支开发
3、需要MAIN分支主功能，则需要merge到BETA分支，是强制覆盖，所以提前备份BETA分支内容
4、BETA分支只允许打tag触发发布


## 部署与环境说明

1. **BETA环境域名**： [beta.imastudio.com](https://beta.imastudio.com)
3. **BETA境构建流程**：
   - 线上发起 merge request 到 beta/main 分支
   - 触发 tag 构建，自动部署到正式环境
   - tag 命名规范：`release-nodejs-beta-YYYYMMDD`，如：`release-nodejs-beta-20250515`
   - C3 构建地址: [http://liveme.c3.cmcloud.org/#/quickentry/flowline/48492](http://liveme.c3.cmcloud.org/#/quickentry/flowline/48492)

> 如需配置正式环境 C3 地址，请联系运维或相关负责人。
