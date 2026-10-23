# Toast 使用情况统计报告

本文档统计了项目中所有使用 `useToast` 的地方及其提示内容（包括变量对应的实际文案）。

生成时间: 2025-10-14

---

## 📊 统计概览

- **总文件数**: 24 个文件
- **Toast 调用总数**: 73 次
  - ✅ Success: 23 次
  - ❌ Error: 28 次
  - ⚠️ Warning: 11 次
  - ℹ️ Info: 0 次
  - 📝 注释状态: 4 次
  - 🔧 Show方法: 4 次

---

## 📁 详细列表（按文件路径分类）

### 1. `api/index.ts`
**共 3 处**

```json
{
  "requestFailed": {
    "line": 145,
    "type": "error",
    "message": "请求失败",
    "variable": "data.message || data.msg",
    "description": "API 请求失败时的动态错误信息,从API响应中取 message 或 msg 字段"
  },
  "authExpired": {
    "line": 158,
    "type": "error",
    "message": "认证已过期,请重新登录!",
    "description": "认证过期(401/403)"
  },
  "sessionCanceled": {
    "line": 168,
    "type": "error",
    "message": "会话终止,请求取消",
    "description": "请求被取消时的提示"
  },
  "networkError": {
    "line": 168,
    "type": "error",
    "message": "网络异常,请稍后重试",
    "variable": "error.response?.data?.message || error.response?.data?.msg || error.message",
    "description": "网络异常/请求错误时的动态错误信息"
  }
}
```

---

### 2. `stores/user.ts`
**共 1 处**

```json
{
  "loginSuccess": {
    "line": 454,
    "type": "success",
    "message": "Login success",
    "condition": "keep === 0",
    "description": "登录成功"
  },
  "registerSuccess": {
    "line": 454,
    "type": "success",
    "message": "Register success",
    "condition": "keep !== 0",
    "description": "注册成功"
  }
}
```

---

### 3. `stores/subs.ts`
**共 4 处**

```json
{
  "purchaseMembershipSuccess": {
    "line": 178,
    "type": "success",
    "message": "Successfully purchased a membership",
    "condition": "type === 'member'",
    "description": "购买会员成功"
  },
  "purchasePointsSuccess": {
    "line": 178,
    "type": "success",
    "message": "Successfully purchased a points, {totalPoints} points will be added to your account",
    "variable": "totalPoints",
    "condition": "type === 'points'",
    "description": "购买积分成功"
  },
  "paymentWindowExists": {
    "line": 323,
    "type": "warning",
    "message": "There is already an order being paid. Please complete the current payment or close the payment window first",
    "description": "支付窗口已存在"
  },
  "unableOpenPaymentWindow": {
    "line": 333,
    "type": "error",
    "message": "Unable to open payment window. Please check your browser popup settings",
    "description": "无法打开支付窗口"
  },
  "orderCreationFailed": {
    "line": 362,
    "type": "error",
    "message": "Order creation failed, please try again",
    "description": "订单创建失败"
  }
}
```

---

### 4. `components/publish-community/useTemplate.vue`
**共 5 处**

```json
{
  "publishSuccess": {
    "line": 138,
    "type": "success",
    "message": "Publish successfully",
    "description": "发布成功"
  },
  "publishFailed": {
    "line": 146,
    "type": "error",
    "message": "Publish failed",
    "commented": true,
    "description": "发布失败（已注释）"
  },
  "editSuccess": {
    "line": 164,
    "type": "success",
    "message": "Edit successfully",
    "description": "编辑成功"
  },
  "editFailed": {
    "line": 171,
    "type": "error",
    "message": "Edit failed",
    "commented": true,
    "description": "编辑失败（已注释）"
  },
  "pleaseEnterTitle": {
    "line": 180,
    "type": "error",
    "message": "Please enter a title",
    "description": "标题为空验证"
  }
}
```

---

### 5. `components/publish-community/uploadComponents/index.vue`
**共 1 处**

```json
{
  "publishSuccess": {
    "line": 180,
    "type": "success",
    "message": "Publish success",
    "description": "发布成功"
  }
}
```

---

### 6. `components/publish-community/uploadComponents/Content.vue`
**共 2 处**

```json
{
  "uploadVideoOnly": {
    "line": 61,
    "type": "error",
    "message": "Please upload video file only",
    "description": "文件类型验证"
  },
  "videoSizeExceed": {
    "line": 68,
    "type": "error",
    "message": "Video file size cannot exceed 200MB",
    "description": "文件大小验证"
  }
}
```

---

### 7. `components/Invitation/index.vue`
**共 2 处**

```json
{
  "creatorApplicationSuccess": {
    "line": 342,
    "type": "success",
    "i18nKey": "creatorIncentive.toast.success",
    "message": {
      "en": "Application submitted successfully! We will review your application as soon as possible.",
      "zh": "申请提交成功！我们会尽快审核您的申请。"
    },
    "description": "创作者申请成功"
  },
  "creatorApplicationFailed": {
    "line": 348,
    "type": "error",
    "i18nKey": "creatorIncentive.toast.error",
    "message": {
      "en": "Failed to submit application. Please try again later.",
      "zh": "提交申请失败，请稍后重试。"
    },
    "description": "创作者申请失败"
  }
}
```

---

### 8. `components/profile/components/ProfileMasonry.vue`
**共 2 处**

```json
{
  "deleteSuccess": {
    "line": 108,
    "type": "success",
    "message": "Delete successfully",
    "description": "删除成功"
  },
  "deleteFailed": {
    "line": 112,
    "type": "error",
    "message": "Delete failed",
    "description": "删除失败"
  }
}
```

---

### 9. `components/message/useIMKit/useUploadedFile.ts`
**共 7 处**

```json
{
  "supportTypeStr": {
    "line": 141,
    "type": "warning",
    "message": "Image,Video,Audio",
    "variable": "supportTypeStr",
    "description": "支持的类型，需要用逗号分隔开"
  },
  "uploadMaxLimit": {
    "line": 141,
    "type": "warning",
    "message": "Upload at most {useMaxLimit} files",
    "variable": "useMaxLimit",
    "description": "文件数量限制"
  },
  "heicNotSupported": {
    "line": 164,
    "type": "warning",
    "message": "[{fileName}] is not supported. Can not upload HEIC file.",
    "variable": "file.name",
    "description": "HEIC 文件不支持"
  },
  "fileTypeNotSupported": {
    "line": 266,
    "type": "warning",
    "message": "[{fileName}] is not supported. Accepted: {supportTypeStr}.",
    "variable": "file.name, supportTypeStr",
    "description": "文件类型不支持"
  },
  "fileSizeExceed": {
    "line": 266,
    "type": "warning",
    "message": "[{fileName}] is not supported. Accepted: {supportTypeStr}. {maxSizeStr}.",
    "variable": "file.name, supportTypeStr, maxSizeStr",
    "description": "文件大小超限"
  },
  "imageDimensionInvalid": {
    "line": 266,
    "type": "warning",
    "message": "[{fileName}] does not meet image requirements. Images must have aspect ratio between {minAspectRatio}-{maxAspectRatio} and dimensions between {minWidth}px-{maxWidth}px.",
    "variable": "file.name, minAspectRatio, maxAspectRatio, minWidth, maxWidth",
    "description": "图片尺寸不符"
  },
  "uploadNotSupported": {
    "line": 274,
    "type": "warning",
    "message": "Upload is not supported.",
    "description": "不支持上传"
  },
  "fileCompressionFailed": {
    "line": 300,
    "type": "error",
    "message": "{fileName} compression failed: {error}",
    "variable": "file.name, error",
    "description": "文件压缩失败"
  },
  "heicConversionFailed": {
    "line": 339,
    "type": "error",
    "message": "{fileName} HEIC转换失败: {errorMessage}",
    "variable": "file.name, error.message",
    "description": "HEIC 转换失败"
  }
}
```

---

### 10. `components/message/components/chat-wrap/ChatSend.vue`
**共 2 处**

```json
{
  "promptMaxLength": {
    "line": 157,
    "type": "error",
    "message": "The prompt max length is {maxLength}",
    "variable": "maxLength",
    "duration": 1000,
    "description": "提示词长度限制"
  },
  "notEnoughCredits": {
    "line": 222,
    "type": "error",
    "message": "Not enough credits. Please recharge.",
    "duration": 1000,
    "description": "积分不足"
  }
}
```

---

### 11. `components/message/components/LlmModeSelect.vue`
**共 1 处**

```json
{
  "selectAtLeastOneModel": {
    "line": 40,
    "type": "error",
    "message": "Please select at least one model",
    "description": "模型选择验证"
  }
}
```

---

### 12. `components/activity/campaign/MitMasonry.vue`
**共 4 处**

```json
{
  "eventNotActive": {
    "line": 37,
    "type": "error",
    "message": "The event hasn't started yet or has ended",
    "description": "活动未开始或已结束"
  },
  "votesUsedUp": {
    "line": 42,
    "type": "error",
    "message": "You've used all your votes.",
    "description": "投票次数用完"
  },
  "voteSuccess": {
    "line": 53,
    "type": "success",
    "message": "Vote successfully",
    "description": "投票成功"
  },
  "voteFailed": {
    "line": 57,
    "type": "error",
    "message": "Failed to vote",
    "description": "投票失败"
  }
}
```

---

### 13. `components/business/user-settings/components/CancelSubscription.vue`
**共 1 处**

```json
{
  "subscriptionCancelled": {
    "line": 32,
    "type": "success",
    "message": "Subscription cancelled successfully",
    "description": "取消订阅成功"
  }
}
```

---

### 14. `components/business/user-settings/UserStatusBar.vue`
**共 1 处**

```json
{
  "inviteCodeNotUsed": {
    "line": 37,
    "type": "warning",
    "message": "You have not used the invitation code yet",
    "commented": true,
    "description": "未使用邀请码（已注释）"
  }
}
```

---

### 15. `components/arena/components/Media.vue`
**共 2 处**

```json
{
  "alreadyVoted": {
    "line": 470,
    "type": "error",
    "message": "You have already voted! Please refresh the page to see new evaluation content!",
    "description": "已投票提示"
  },
  "copyShareLink": {
    "line": 593,
    "type": "success/error",
    "message": "Copy success / Copy fail",
    "condition": "res ? 'Copy success' : 'Copy fail'",
    "duration": 2000,
    "description": "复制分享链接结果"
  }
}
```

---

### 16. `components/arena/components/Box.vue`
**共 1 处**

```json
{
  "voteSuccess": {
    "line": 37,
    "type": "show",
    "message": "Vote success",
    "duration": 2000,
    "description": "Mini Arena 投票成功"
  }
}
```

---

### 17. `components/business/user-settings/components/UserInfoSettings.vue`
**共 10 处**

```json
{
  "enterPreferredName": {
    "line": 52,
    "type": "error",
    "message": "Please enter your preferred name",
    "description": "用户名为空验证"
  },
  "preferredNameMaxLength": {
    "line": 59,
    "type": "error",
    "message": "The preferred name cannot exceed 64 characters",
    "commented": true,
    "description": "用户名长度验证（已注释）"
  },
  "updatePreferredNameSuccess": {
    "line": 65,
    "type": "success",
    "message": "Update preferred name successfully",
    "description": "更新用户名成功"
  },
  "profileUpdated": {
    "line": 103,
    "type": "success",
    "message": "Updated",
    "description": "更新个人简介成功"
  },
  "sameAsOriginal": {
    "line": 127,
    "type": "error",
    "message": "That is the same as the original",
    "description": "未修改提示"
  },
  "urlUpdated": {
    "line": 135,
    "type": "success",
    "message": "Updated",
    "description": "更新URL成功"
  },
  "operationCanceled": {
    "line": 142,
    "type": "success",
    "message": "Canceled",
    "description": "取消操作"
  },
  "creatorStatusUpdated": {
    "line": 199,
    "type": "success",
    "message": "Updated",
    "description": "取消创作者状态成功"
  },
  "creatorCancelOperationCanceled": {
    "line": 209,
    "type": "success",
    "message": "Canceled",
    "description": "取消创作者操作已取消"
  },
  "distributionSettingUpdated": {
    "line": 241,
    "type": "success",
    "message": "Updated",
    "description": "更新分发设置成功"
  }
}
```

---

### 18. `components/community/components/OperationBanner.vue`
**共 2 处**

```json
{
  "alreadyCreator": {
    "line": 27,
    "type": "success",
    "message": "You are already a creator！",
    "description": "已是创作者"
  },
  "applicationUnderReview": {
    "line": 31,
    "type": "success",
    "message": "Your application is under review.",
    "description": "申请审核中"
  }
}
```

---

### 19. `components/business/user-settings/components/ExplorePlans.vue`
**共 1 处**

```json
{
  "paymentWindowExistsInPlan": {
    "line": 74,
    "type": "warning",
    "message": "Payment window already exists",
    "description": "支付窗口已存在"
  }
}
```

---

### 19. `composables/useUserPoint.ts`
**共 4 处**

```json
{
  "inviteCodeUsedSuccess": {
    "line": 193,
    "type": "success",
    "message": "Invite code used successfully",
    "description": "邀请码使用成功"
  },
  "waitForApproval": {
    "line": 213,
    "type": "error",
    "message": "Please wait for the application to be approved",
    "description": "等待申请批准"
  },
  "beenApproved": {
    "line": 217,
    "type": "error",
    "message": "Been Approved. Please check your email.",
    "description": "已批准提示"
  },
  "applyInviteCodeSuccess": {
    "line": 227,
    "type": "success",
    "message": "apply invite code success",
    "description": "申请邀请码成功"
  }
}
```

---

### 20. `components/business/user-settings/components/BuyCredits.vue`
**共 1 处**

```json
{
  "paymentWindowExistsInCredits": {
    "line": 33,
    "type": "warning",
    "message": "Payment window already exists",
    "description": "支付窗口已存在"
  }
}
```

---

### 22. `components/business/user-settings/components/AvatarSetting.vue`
**共 1 处**

```json
{
  "avatarUpdated": {
    "line": 37,
    "type": "success",
    "message": "Avatar updated successfully",
    "description": "头像更新成功"
  }
}
```

---

### 23. `composables/useToast.ts`
**共 4 处**

```json
{
  "toastSuccess": {
    "line": 11,
    "type": "success",
    "message": "{message}",
    "variable": "message",
    "description": "useToast success 方法实现"
  },
  "toastError": {
    "line": 12,
    "type": "error",
    "message": "{message}",
    "variable": "message",
    "description": "useToast error 方法实现"
  },
  "toastInfo": {
    "line": 13,
    "type": "info",
    "message": "{message}",
    "variable": "message",
    "description": "useToast info 方法实现"
  },
  "toastWarning": {
    "line": 15,
    "type": "warning",
    "message": "{message}",
    "variable": "message",
    "description": "useToast warning 方法实现"
  }
}
```

---

### 24. `components/discord-free-points/Main.vue`
**共 2 处**

```json
{
  "claimedSuccess": {
    "line": 21,
    "type": "success",
    "message": "Successfully claimed",
    "description": "领取成功"
  },
  "codeAlreadyClaimed": {
    "line": 24,
    "type": "error",
    "message": "Code has already been claimed",
    "commented": true,
    "description": "已领取（已注释）"
  }
}
```

---

### 25. `components/common/DropUpload.vue`
**共 2 处**

```json
{
  "onlyOneFileAllowed": {
    "line": 70,
    "type": "warning",
    "message": "Only one file can be uploaded",
    "description": "单文件上传限制"
  },
  "maxFilesLimit": {
    "line": 76,
    "type": "warning",
    "message": "Upload at most {maxFiles} files",
    "variable": "props.maxFiles",
    "description": "多文件上传限制"
  }
}
```

---

### 26. `components/common/AppDropFile.vue`
**共 1 处**

```json
{
  "pleaseSelectFile": {
    "line": 70,
    "type": "warning",
    "message": "请选择文件",
    "variable": "props.emptyTip",
    "default": "请选择文件",
    "description": "空文件提示"
  }
}
```

---

### 27. `components/business/user-settings/components/PrivacySettings.vue`
**共 1 处**

```json
{
  "dataCleared": {
    "line": 24,
    "type": "success",
    "message": "Data has been cleared",
    "description": "数据清除成功"
  }
}
```

---

### 28. `components/business/SetInviteCodeDialog.vue`
**共 2 处**

```json
{
  "enterInviteCode": {
    "line": 35,
    "type": "error",
    "message": "Please enter your invite code",
    "description": "邀请码为空验证"
  },
  "inviteCodeMaxLength": {
    "line": 39,
    "type": "error",
    "message": "Max length is 20",
    "description": "邀请码长度验证"
  }
}
```

### 29. `components/business/ShareAppDialog.vue`
**共 2 处**

```json
{
  "enterInviteCode": {
    "line": 30,
    "type": "show",
    "message": "Copy success",
    "description": ""
  },
  "inviteCodeMaxLength": {
    "line": 39,
    "type": "error",
    "message": "Copy fail",
    "description": ""
  }
}
```

### 30. `components/profile/components/UserInfo.vue`
**共 1 处**

```json
{
  "copyShareLink": {
    "line": 69,
    "type": "show",
    "message": "Copy success / Copy fail",
    "condition": "res ? 'Copy success' : 'Copy fail'",
    "duration": 1000,
    "description": "复制分享链接结果"
  }
}
```

### 31. `components/activity/campaign/TopInfo.vue`
**共 1 处**

```json
{
  "copyShareLink": {
    "line": 27,
    "type": "show",
    "message": "Copy success / Copy fail",
    "condition": "res ? 'Copy success' : 'Copy fail'",
    "duration": 1000,
    "description": "复制分享链接结果"
  }
}
```

---

### 1. 国际化问题 ⚠️
以下文件中的 toast 提示内容**没有使用国际化**，建议统一使用 `$t()` 进行国际化处理：

**中文硬编码**：
- `api/index.ts` (3处)
  - `'请求失败'` (行145)
  - `'认证已过期，请重新登录！'` (行158)
  - `'会话终止，请求取消'`、`'网络异常，请稍后重试'` (行163, 166)
- `components/message/useIMKit/useUploadedFile.ts` (1处)
  - `'HEIC转换失败'` (行339)
- `components/common/AppDropFile.vue` (1处)
  - `'请选择文件'` (默认值)

**英文硬编码** (应该国际化的文件):
- 所有其他组件的英文提示都是硬编码

### 2. 提示内容一致性 📝
发现以下提示内容存在不一致：

**成功提示措辞不统一**：
- `'Publish successfully'` (useTemplate.vue:138)
- `'Publish success'` (uploadComponents/index.vue:180)
- `'Edit successfully'` (useTemplate.vue:164)
- 建议统一为：`'Published successfully'` / `'Edited successfully'`

**更新提示过于简单**：
- 多处使用 `'Updated'`，建议改为更具体的描述
- 例如：`'Profile updated successfully'`、`'Settings updated successfully'`

**邀请码相关提示不一致**：
- `'Invite code used successfully'` (useUserPoint.ts:193)
- `'apply invite code success'` (useUserPoint.ts:227)
- 建议统一为：`'Invite code applied successfully'`

**投票相关提示不一致**：
- `'Vote success'` (Box.vue:37)
- `'Vote successfully'` (MitMasonry.vue:53)
- 建议统一为：`'Voted successfully'` 或 `'Vote submitted successfully'`

**复制成功提示不一致**：
- `'Copy success'` (Media.vue:593)
- `'Copy fail'` (Media.vue:593)
- 建议改为：`'Copied successfully'` / `'Failed to copy'`

### 3. 注释代码清理 🧹
以下位置存在注释的 toast 代码，建议确认是否需要删除：

```json
{
  "commentedToasts": [
    {
      "file": "components/publish-community/useTemplate.vue",
      "lines": [146, 171],
      "messages": [
        "Publish failed",
        "Edit failed"
      ]
    },
    {
      "file": "components/business/user-settings/UserStatusBar.vue",
      "line": 37,
      "message": "You have not used the invitation code yet"
    },
    {
      "file": "components/business/user-settings/components/UserInfoSettings.vue",
      "line": 59,
      "message": "The preferred name cannot exceed 64 characters"
    },
    {
      "file": "components/discord-free-points/Main.vue",
      "line": 24,
      "message": "Code has already been claimed"
    }
  ]
}
```

### 4. 动态变量文案完善 🔧
以下使用动态变量的 toast 建议添加更多上下文信息：

**API 错误提示** (`api/index.ts`):
- 当前：从 API 返回的 `data.message` 或 `data.msg`
- 建议：确保后端返回的错误信息都已国际化

**文件上传提示** (`useUploadedFile.ts`):
- 行266的 `validTip` 变量包含多种情况的详细文案，✅ 做得很好
- 建议：将这些文案提取为常量或配置，便于维护

**支付相关提示** (`stores/subs.ts`):
- 行178的积分购买成功提示使用了模板字符串插入 `totalPoints`
- ✅ 提示内容清晰明确

### 5. Duration 设置统一 ⏱️
发现以下 toast 设置了自定义 duration：

```json
{
  "customDurations": [
    {
      "file": "components/message/components/chat-wrap/ChatSend.vue",
      "lines": [157, 222],
      "duration": 1000,
      "descriptions": [
        "提示词长度限制",
        "积分不足"
      ]
    }
  ],
  "suggestions": [
    "将常用的 duration 值提取为常量",
    "在 useToast.ts 中统一管理默认配置"
  ]
}
```

### 6. 错误提示改进建议 💡
部分错误提示可以更友好和具体：

**需要改进的提示**：
- ❌ `'Delete failed'` → ✅ `'Failed to delete. Please try again.'`
- ❌ `'Failed to vote'` → ✅ `'Failed to submit vote. Please try again.'`
- ❌ `'Max length is 20'` → ✅ `'Invite code must be 20 characters or less'`
- ❌ `'Copy fail'` → ✅ `'Failed to copy to clipboard'`

**Arena 相关提示优化**：
- `'You have already voted! Please refresh the page to see new evaluation content!'` (Media.vue:470)
  - 提示内容较长，建议简化为：`'Already voted. Refresh to see new content.'`
- `'Vote success'` → `'Vote submitted successfully'`
- 分享链接的复制结果提示可以更具体，如添加链接类型说明

**建议添加操作建议**：
- 错误提示后告诉用户可以做什么
- 例如：`'Upload failed. Please check your network connection and try again.'`

---

## 📝 优化任务清单

### 高优先级 🔴
- [ ] **国际化所有 toast 提示**
  - [ ] `api/index.ts` 的中文提示
  - [ ] `useUploadedFile.ts` 的中文提示
  - [ ] `AppDropFile.vue` 的中文默认值
  - [ ] 所有英文硬编码提示
  
- [ ] **清理注释代码** (4处)
  - [ ] `components/publish-community/useTemplate.vue` (2处)
  - [ ] `components/business/user-settings/UserStatusBar.vue` (1处)
  - [ ] `components/business/user-settings/components/UserInfoSettings.vue` (1处)
  - [ ] `components/discord-free-points/Main.vue` (1处)

### 中优先级 🟡
- [ ] **统一提示内容措辞**
  - [ ] 成功提示：统一为 `'xxx successfully'` 格式
  - [ ] 更新提示：改为具体描述而非简单的 `'Updated'`
  - [ ] 邀请码提示：统一表达方式

- [ ] **改进错误提示**
  - [ ] 为错误提示添加操作建议
  - [ ] 让提示更具体、更友好

### 低优先级 🟢  
- [ ] **统一 toast 配置管理**
  - [ ] 提取 duration 常量
  - [ ] 在 `useToast.ts` 中统一管理配置
  
- [ ] **文案常量化**
  - [ ] 提取 `useUploadedFile.ts` 中的文件验证文案
  - [ ] 便于维护和测试

---

## 📊 附录

### A. 变量类型说明

本报告中标记的变量类型包括：

1. **动态变量**: 运行时从数据中获取的值（如 `file.name`, `error.message`）
2. **条件变量**: 根据条件判断显示不同内容（如三元表达式）
3. **国际化变量**: 使用 `$t()` 函数的多语言文案
4. **参数变量**: 函数参数传入的值
5. **配置变量**: 从 props 或配置对象中获取的值

### B. 国际化文件路径

项目中的国际化文件位置：
- 英文: `/i18n/locales/en/*.json`
- 中文: `/i18n/locales/zh/*.json`

当前已使用国际化的 toast:
- `creatorIncentive.toast.success` (创作者申请成功)
- `creatorIncentive.toast.error` (创作者申请失败)

### C. Toast 类型统计

```json
{
  "statistics": {
    "success": {
      "count": 23,
      "percentage": "31.5%",
      "icon": "✅"
    },
    "error": {
      "count": 28,
      "percentage": "38.4%",
      "icon": "❌"
    },
    "warning": {
      "count": 11,
      "percentage": "15.1%",
      "icon": "⚠️"
    },
    "info": {
      "count": 0,
      "percentage": "0%",
      "icon": "ℹ️"
    },
    "show": {
      "count": 4,
      "percentage": "5.5%",
      "icon": "📢",
      "description": "使用 toast.show 方法"
    },
    "commented": {
      "count": 4,
      "percentage": "5.5%",
      "icon": "📝"
    },
    "implementation": {
      "count": 4,
      "percentage": "5.5%",
      "icon": "🔧",
      "description": "useToast 实现"
    },
    "total": {
      "count": 73,
      "percentage": "100%"
    }
  }
}
```

### D. 最常见的 Toast 场景

1. **文件上传验证** (7处) - `useUploadedFile.ts`
2. **用户设置更新** (10处) - `UserInfoSettings.vue`
3. **支付相关** (4处) - `subs.ts`, `ExplorePlans.vue`, `BuyCredits.vue`
4. **发布内容** (6处) - `useTemplate.vue`, `uploadComponents/`
5. **API 错误处理** (3处) - `api/index.ts`
6. **投票相关** (3处) - `Media.vue`, `Box.vue`, `MitMasonry.vue`

---

## 🎯 总结

本项目共在 **30 个文件**中使用了 **73 次** toast 提示。

**主要发现**：
- ✅ 大部分 toast 使用合理，提示清晰
- ⚠️ 存在中英文混用问题，需要统一国际化
- ⚠️ 部分提示措辞不一致，需要统一规范（特别是投票和复制相关的提示）
- ℹ️ 有 4 处注释的 toast 代码需要清理
- ℹ️ `useUploadedFile.ts` 中的文件验证提示做得很好，包含详细的错误信息
- ℹ️ Arena 组件新增了 3 处 toast（Media.vue 2处，Box.vue 1处），其中有2处使用了 `toast.show` 方法

**建议优先处理**：
1. 国际化所有 toast 提示
2. 清理注释代码
3. 统一提示措辞风格

---

*此文档由自动化工具生成*  
*生成时间: 2025-10-14*  
*包含变量详情分析*

