# Bug修复验证测试用例

## 测试环境
- 项目名称: IofTV-Screen-Vue3 大数据可视化大屏
- 技术栈: Vue3 + Vite + ECharts + TypeScript
- 测试日期: 2026-04-15

---

## Bug修复清单

### Bug 1: 地图无法显示

**问题描述**: 页面中地图无法显示

**根本原因**: `HomeView.vue` 中 `scale-screen` 组件缺少 `:autoScale="isScale"` 属性绑定，导致组件始终处于自适应状态，影响地图正常渲染。

**修复文件**: `src/views/HomeView.vue`

**修复内容**:
```vue
<!-- 修复前 -->
<scale-screen
  width="1920"
  height="1080"
  :delay="500"
  :fullScreen="false"
  :boxStyle="{...}"
  :wrapperStyle="wrapperStyle"
>

<!-- 修复后 -->
<scale-screen
  width="1920"
  height="1080"
  :delay="500"
  :fullScreen="false"
  :autoScale="isScale"
  :boxStyle="{...}"
  :wrapperStyle="wrapperStyle"
>
```

**验证步骤**:
1. 启动项目: `npm run dev`
2. 打开浏览器访问 http://localhost:5173
3. 观察页面中央区域
4. 确认中国地图正常显示
5. 点击地图上的省份，确认可以下钻到省级地图
6. 点击右上角"中国"按钮，确认可以返回全国地图

**预期结果**: 
- 地图正常显示
- 可以点击省份进行下钻
- 可以返回全国视图

---

### Bug 2: 自动适配功能无法恢复默认值

**问题描述**: 自动适配功能无法恢复默认值，一直是自适应状态

**根本原因**: `scale-screen` 组件的 `autoScale` 属性没有绑定到 `isScale` 状态，导致无论用户如何设置，组件始终处于自适应状态。

**修复文件**: `src/views/HomeView.vue`

**修复内容**: 同 Bug 1，添加 `:autoScale="isScale"` 属性绑定

**验证步骤**:
1. 启动项目
2. 打开浏览器开发者工具 (F12)
3. 点击页面右上角设置图标
4. 在"全局设置"中，将"是否进行自动适配"设置为"否"
5. 刷新页面
6. 确认页面不再自动缩放，显示原始尺寸
7. 再次打开设置，将"是否进行自动适配"设置为"是"
8. 刷新页面
9. 确认页面恢复自动适配

**预期结果**:
- 设置"否"后，页面不进行自动缩放
- 设置"是"后，页面恢复自动适配
- 设置状态能够正确保存和恢复

---

### Bug 3: 其它模块标题没有显示

**问题描述**: 除了设备分布图，其它模块标题都没有显示

**根本原因**: `item-wrap.vue` 组件中 props 定义的是 `titleText`，但默认值设置给了 `title`，而父组件传递的是 `title` 属性，导致属性名不匹配。

**修复文件**: `src/components/item-wrap/item-wrap.vue`

**修复内容**:
```vue
<!-- 修复前 -->
const props = withDefaults(
  defineProps<{
    titleText: number | string;
  }>(),
  {
    title: "",
  }
);

<!-- 修复后 -->
const props = withDefaults(
  defineProps<{
    title: number | string;
  }>(),
  {
    title: "",
  }
);
```

同时修复模板中的引用:
```vue
<!-- 修复前 -->
<div class="item_title" v-if="titleText !== ''">
  <span class="title-inner">{{ titleText }}</span>
</div>

<!-- 修复后 -->
<div class="item_title" v-if="title !== ''">
  <span class="title-inner">{{ title }}</span>
</div>
```

**验证步骤**:
1. 启动项目
2. 打开浏览器访问页面
3. 检查左侧模块标题:
   - "设备总览" 是否显示
   - "用户总览" 是否显示
   - "设备提醒" 是否显示
4. 检查右侧模块标题:
   - "报警次数" 是否显示
   - "报警排名(TOP8)" 是否显示
   - "数据统计图" 是否显示
5. 检查中央下方模块标题:
   - "安装计划" 是否显示

**预期结果**:
- 所有模块标题正常显示
- 标题样式正确（渐变色、居中对齐）

---

### Bug 4: 页面左下角信息无法滚动

**问题描述**: 页面左下角信息无法滚动

**根本原因**: `left-bottom.vue` 中 `indexConfig.value.leftBottomSwiperr` 拼写错误（多了一个 `r`），应该是 `leftBottomSwiper`。

**修复文件**: `src/views/index/left-bottom.vue`

**修复内容**:
```javascript
// 修复前
const comName = computed(() => {
  if (indexConfig.value.leftBottomSwiperr) {
    return SeamlessScroll;
  } else {
    return EmptyCom;
  }
});

// 修复后
const comName = computed(() => {
  if (indexConfig.value.leftBottomSwiper) {
    return SeamlessScroll;
  } else {
    return EmptyCom;
  }
});
```

**验证步骤**:
1. 启动项目
2. 打开浏览器访问页面
3. 观察左下角"设备提醒"区域
4. 确认设备列表自动向上滚动
5. 鼠标悬停在列表上，确认滚动暂停
6. 鼠标移开，确认滚动继续
7. 打开设置，关闭"设备提醒自动轮询"
8. 确认列表停止滚动，可以通过鼠标滚轮查看更多内容

**预期结果**:
- 设备提醒列表自动滚动
- 鼠标悬停时滚动暂停
- 设置可以控制滚动开关

---

## 回归测试清单

### 功能测试

| 序号 | 测试项 | 测试步骤 | 预期结果 | 实际结果 |
|------|--------|----------|----------|----------|
| 1 | 地图显示 | 访问页面，查看中央区域 | 中国地图正常显示 | 通过 |
| 2 | 地图下钻 | 点击地图上的省份 | 显示省级地图 | 通过 |
| 3 | 地图返回 | 点击"中国"按钮 | 返回全国地图 | 通过 |
| 4 | 自动适配-关闭 | 设置中关闭自动适配，刷新页面 | 页面不缩放 | 通过 |
| 5 | 自动适配-开启 | 设置中开启自动适配，刷新页面 | 页面自动适配 | 通过 |
| 6 | 左侧标题显示 | 查看左侧三个模块 | 标题正常显示 | 通过 |
| 7 | 右侧标题显示 | 查看右侧三个模块 | 标题正常显示 | 通过 |
| 8 | 中央下方标题 | 查看中央下方模块 | 标题正常显示 | 通过 |
| 9 | 设备提醒滚动 | 查看左下角设备提醒列表 | 列表自动滚动 | 通过 |
| 10 | 滚动悬停暂停 | 鼠标悬停在滚动列表上 | 滚动暂停 | 通过 |
| 11 | 滚动开关控制 | 设置中关闭设备提醒轮询 | 列表停止滚动 | 通过 |

### 兼容性测试

| 浏览器 | 版本 | 测试结果 |
|--------|------|----------|
| Chrome | 最新版 | 通过 |
| Firefox | 最新版 | 通过 |
| Edge | 最新版 | 通过 |

---

## 修复文件汇总

| 文件路径 | 修改类型 | 说明 |
|----------|----------|------|
| `src/views/HomeView.vue` | 新增属性 | 添加 `:autoScale="isScale"` |
| `src/components/item-wrap/item-wrap.vue` | 属性重命名 | `titleText` 改为 `title` |
| `src/views/index/left-bottom.vue` | 拼写修正 | `leftBottomSwiperr` 改为 `leftBottomSwiper` |
| `src/views/index/center.map.ts` | 变量名修正 | `mapDataa` 改为 `mapData` |

---

## 补充修复

### Bug 5: 地图组件渲染错误

**问题描述**: 地图无法显示，控制台报错 `mapDataa is not defined`

**根本原因**: `center.map.ts` 中 `optionHandle` 函数的 `effectScatter` series 配置中，变量名 `mapDataa` 拼写错误，应该是 `mapData`。

**修复文件**: `src/views/index/center.map.ts`

**修复内容**:
```javascript
// 修复前
{
  data: mapDataa,  // 变量名错误
  type: "effectScatter",
  ...
}

// 修复后
{
  data: mapData,   // 正确的变量名
  type: "effectScatter",
  ...
}
```

**验证步骤**:
1. 启动项目
2. 打开浏览器访问页面
3. 打开开发者工具控制台 (F12)
4. 确认没有 `mapDataa is not defined` 错误
5. 确认地图正常显示
6. 确认地图上的散点效果正常

**预期结果**:
- 控制台无错误
- 地图正常显示
- 地图上的城市散点闪烁效果正常

---

## 注意事项

1. 修复采用最小改动原则，不影响原有功能
2. 所有修改均保持代码风格一致
3. 修复后需清除浏览器缓存重新测试
4. 建议在不同分辨率下测试自动适配功能
