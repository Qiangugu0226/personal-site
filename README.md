# personal-site

> 我的个人主页 —— 用纯 HTML / CSS / JavaScript 手写，用来记录学习和展示自己。

🔗 **在线预览**：https://qiangugu0226.github.io/personal-site/

![项目截图](screenshot.png)

---

## 项目简介

这是我学前端后独立完成的第一个完整页面，也是我的个人名片。

它的作用不只是"展示"，更是我的练习场：响应式布局、CSS 变量、
深色模式、localStorage 持久化、无障碍属性，都是在这个页面里第一次真正用起来的。

## 功能

- [x] 响应式布局，手机 / 平板 / 桌面都能正常显示
- [x] 深色 / 浅色模式切换，并记住用户的选择
- [x] 首次访问自动跟随系统的深色模式设置
- [x] 平滑滚动导航
- [x] 学习路线时间线
- [x] 无障碍支持（aria 属性、支持系统「减少动态效果」设置）

## 技术栈

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

无任何框架和依赖，纯手写。

## 本地运行

```bash
git clone https://github.com/Qiangugu0226/personal-site.git
cd personal-site
```

然后用以下任一方式打开：

- **推荐**：在 VS Code 里右键 `index.html` → `Open with Live Server`（改代码自动刷新）
- 或者直接双击 `index.html`

## 项目结构

```
personal-site/
├── index.html          # 页面结构
├── css/
│   └── style.css       # 样式（含深色模式与响应式）
├── js/
│   └── main.js         # 主题切换、年份更新
├── screenshot.png      # 项目截图
├── .gitignore
└── README.md
```

---

## 关键实现说明

下面三处是代码里最需要解释的地方，也是我自己最想讲清楚的部分。

### 1. 深色模式怎么做到「刷新不丢」

主题状态不写在 CSS 里，而是挂在根元素的一个属性上（`js/main.js:42`）：

```js
document.documentElement.setAttribute('data-theme', theme);
```

CSS 里所有颜色都写成 `[data-theme="dark"]` 下的覆盖值。这样切换主题只是改一个属性，不需要动任何样式代码。

但属性只活在内存里，刷新就没了。所以 `applyTheme()` 在设置属性的同时把它存进 `localStorage`：

```js
// js/main.js:41-45
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateIcon(theme);
}
```

下次打开时按「上次的选择 > 系统设置 > 浅色」的优先级决定用哪个：

```js
// js/main.js:52-61
function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}
```

注意这里判断的是 `saved === 'light' || saved === 'dark'`，而不是简单的 `if (saved)`：`localStorage` 存的永远是字符串，取不到的 key 返回的是 `null` 而不是 `undefined`，所以要显式校验取值是不是合法的那两个，避免脏数据被带进页面。

### 2. 宽度用 max-width，而不是 width

```css
/* css/style.css:37 */
:root { --max-width: 1080px; }

/* css/style.css:77-81 */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}
```

`width: 1080px` 的意思是「必须正好 1080px 宽」，屏幕比它窄就只能横向滚动；`max-width` 的意思是「最多 1080px」，屏幕窄了会自动收窄。`margin: 0 auto` 负责宽屏下居中，`padding: 0 24px` 负责窄屏下和屏幕边缘留出距离。

图片再加一条兜底规则（`css/style.css:68`）：

```css
img { max-width: 100%; height: auto; display: block; }
```

`max-width: 100%` 保证图片永远不撑破容器，`height: auto` 保证压缩时比例不变形，`display: block` 消掉行内元素底部那条多余的空隙。这三行几乎是每个网页都要写的。

### 3. 锚点跳转被吸顶导航挡住

导航栏用 `position: sticky` 固定在顶部，而浏览器默认会把锚点目标滚到**视口最顶端**，结果区块标题正好被导航栏盖住一截。CSS 有一个属性就是专门解决这件事的：

```css
/* css/style.css:52-56 */
html {
  scroll-behavior: smooth;
  /* 锚点跳转时留出吸顶导航的高度，避免标题被遮住 */
  scroll-padding-top: 80px;
}
```

`scroll-padding-top: 80px` 相当于给滚动容器顶部划出 80px 的安全区，锚点会停在这个安全区下方，正好躲开导航栏；`scroll-behavior: smooth` 让跳转变成平滑滚动而不是瞬间跳过去。

这类「一个属性解决一个具体问题」的情况在 CSS 里很常见。遇到问题可以先查有没有现成的属性，而不是急着用 JavaScript 去绕。

---

## 后续计划

- [ ] 加一个「项目作品」区块，把 study-tracker 和以后的项目放进来
- [ ] 导航滚动时高亮当前所在区块（用 IntersectionObserver 监听各个 section）
- [ ] 首屏加一个打字机效果的自我介绍
- [ ] 技能条滚动到可视区域时才展开

## 联系方式

- 邮箱：guguchen0226@gmail.com
- GitHub：[@Qiangugu0226](https://github.com/Qiangugu0226)
