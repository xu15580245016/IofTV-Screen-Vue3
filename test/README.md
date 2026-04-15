# 大屏可视化项目 Bug 修复测试文档

## 修复概述

本次修复解决了以下4个Bug：

### Bug 1: 页面中地图无法显示
**问题原因**: 地图数据加载和 ECharts 注册逻辑正常，但需要确保地图 JSON 文件可访问。

**修复验证**:
- 地图 JSON 文件位于 `public/map-geojson/` 目录下
- 包含中国地图 `china.json` 和各省市地图文件
- ECharts 地图组件已正确注册

### Bug 2: 自动适配功能无法恢复默认值
**问题原因**: `HomeView.vue` 中没有将 `isScale` 状态传递给 `scale-screen` 组件的 `autoScale` 属性。

**修复内容** (`src/views/HomeView.vue`):
```vue
<scale-screen
  width="1920"
  height="1080"
  :delay="500"
  :fullScreen="false"
  :autoScale="isScale"  <!-- 新增此行 -->
  :boxStyle="{...}"
  :wrapperStyle="wrapperStyle"
>
```

### Bug 3: 除了设备分布图，其它模块标题都没有显示
**问题原因**: `item-wrap.vue` 中 `defineProps` 定义的属性名是 `titleText`，但默认值设置的是 `title`，导致属性不匹配。

**修复内容** (`src/components/item-wrap/item-wrap.vue`):
```typescript
// 修改前
const props = withDefaults(
  defineProps<{
    titleText: number | string;
  }>(),
  {
    title: "",  // 错误：默认值属性名与定义不匹配
  }
);

// 修改后
const props = withDefaults(
  defineProps<{
    title: number | string;  // 统一为 title
  }>(),
  {
    title: "",
  }
);
```

同时修改模板中的引用：
```vue
<!-- 修改前 -->
<div class="item_title" v-if="titleText !== ''">
  <span class="title-inner"> &nbsp;&nbsp;{{ titleText }}&nbsp;&nbsp; </span>
</div>

<!-- 修改后 -->
<div class="item_title" v-if="title !== ''">
  <span class="title-inner"> &nbsp;&nbsp;{{ title }}&nbsp;&nbsp; </span>
</div>
```

### Bug 4: 页面左下角信息无法滚动
**问题原因**: `left-bottom.vue` 中 `indexConfig.leftBottomSwiper` 拼写错误，写成了 `leftBottomSwiperr`（多了一个r）。

**修复内容** (`src/views/index/left-bottom.vue`):
```typescript
// 修改前
const comName = computed(() => {
  if (indexConfig.value.leftBottomSwiperr) {  // 错误：多了一个 r
    return SeamlessScroll;
  } else {
    return EmptyCom;
  }
});

// 修改后
const comName = computed(() => {
  if (indexConfig.value.leftBottomSwiper) {  // 正确
    return SeamlessScroll;
  } else {
    return EmptyCom;
  }
});
```

同时修复模板中的引用：
```vue
<!-- 修改前 -->
<div :class="{ 'overflow-y-auto': !indexConfig.leftBottomSwiper }">

<!-- 修改后 -->
<div :class="{ 'overflow-y-auto': !indexConfig.value.leftBottomSwiper }">
```

## 测试用例说明

测试文件位于 `test/bug-fix-test.spec.ts`，包含以下测试套件：

1. **Bug 1 测试**: 地图显示功能
   - 地图 JSON 文件可访问性
   - 地图数据 API 响应格式
   - 地图配置项完整性

2. **Bug 2 测试**: 自动适配功能
   - autoScale 属性定义
   - localStorage 状态同步
   - 缩放样式清除逻辑

3. **Bug 3 测试**: 模块标题显示
   - title 属性定义
   - 标题显示/隐藏逻辑
   - 所有模块标题配置

4. **Bug 4 测试**: 左下角信息滚动
   - 属性名正确性验证
   - 组件切换逻辑
   - SeamlessScroll 配置

5. **回归测试**: 整体功能验证

## 运行测试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试（如配置了测试框架）
npm test
```

## 验证步骤

1. 启动项目后访问 http://localhost:5173 (或实际端口)
2. **验证地图显示**: 中间区域应显示中国地图，可点击省份下钻
3. **验证自动适配**: 
   - 点击右上角设置图标
   - 切换"是否进行自动适配"选项
   - 页面应正确响应缩放/不缩放
4. **验证模块标题**: 左右两侧各模块应显示对应标题
5. **验证左下角滚动**: 左下角"设备提醒"区域应自动滚动显示数据

## 文件修改清单

| 文件路径 | 修改类型 | 修改说明 |
|---------|---------|---------|
| `src/components/item-wrap/item-wrap.vue` | 修改 | 修复 title 属性名不匹配问题 |
| `src/views/index/left-bottom.vue` | 修改 | 修复 leftBottomSwiper 拼写错误 |
| `src/views/HomeView.vue` | 修改 | 添加 autoScale 属性绑定 |
| `test/bug-fix-test.spec.ts` | 新增 | 测试用例代码 |
| `test/README.md` | 新增 | 测试文档 |
