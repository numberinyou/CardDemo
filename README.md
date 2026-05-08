# Solitaire Card Demo

## 1. 项目简介

这是一个基于 Cocos Creator 3.8.8 制作的纸牌 Demo。

项目目标是实现一个简化版纸牌交互流程，包括：

- 主牌区卡牌点击匹配
- 备用牌移动到底牌区
- 底牌顶部牌更新
- 连续回退功能
- 基于 MVC 思路的代码分层

本项目不是一次性完成所有逻辑，而是按照正常开发流程分阶段完成，包括项目初始化、场景搭建、资源配置、数据模型、视图渲染、点击链路、匹配逻辑、备用牌逻辑、回退功能和文档整理。

---

## 2. 运行环境

- Cocos Creator：3.8.8
- 开发语言：TypeScript
- Git：用于版本管理

---

## 3. 如何运行项目

1. 使用 Cocos Creator 3.8.8 打开项目根目录。
2. 打开场景：

```text
assets/scenes/Game.scene
````

3. 点击 Cocos Creator 顶部的运行按钮。
4. 运行后可以看到背景、卡牌和回退按钮。

初始测试牌包括：

```text
底牌区 Tray：♣4
主牌区 PlayField：♦3、♠2
备用牌 Stack：♥A
```

---

## 4. 已实现功能

### 4.1 卡牌显示

项目通过 `CardView.prefab` 显示单张卡牌。

卡牌结构包括：

```text
CardView
├── BaseSprite
├── BigNumberSprite
├── SmallNumberSprite
├── SuitSprite
└── BackSprite
```

其中：

* `BaseSprite`：卡牌正面底图
* `BigNumberSprite`：卡牌中间的大数字
* `SmallNumberSprite`：卡牌左上角的小数字
* `SuitSprite`：卡牌花色
* `BackSprite`：卡牌背面

---

### 4.2 点击事件链路

卡牌点击流程如下：

```text
CardView 捕获点击
↓
GameView 接收 cardId
↓
GameTestController 根据 cardId 找到 CardModel
↓
根据卡牌所在区域执行不同逻辑
```

点击卡牌时，控制台会输出对应的卡牌 ID 和区域。

---

### 4.3 桌面牌匹配逻辑

当点击主牌区 `PlayField` 的牌时，会判断它是否可以和底牌区 `Tray` 顶部牌匹配。

匹配规则：

```text
两张牌点数相差 1 即可匹配
花色不参与判断
```

例如：

```text
♣4 可以匹配 ♦3
♣4 不能匹配 ♠2
♥A 可以匹配 ♠2
```

---

### 4.4 备用牌替换底牌

当点击备用牌区 `Stack` 顶部牌时，该牌会直接移动到底牌区 `Tray`，并成为新的底牌顶部牌。

例如：

```text
点击 ♥A
↓
♥A 从 Stack 移动到 Tray
↓
♥A 成为新的 Tray 顶部牌
```

之后 `♠2` 可以和 `♥A` 匹配。

---

### 4.5 连续回退功能

每次卡牌成功移动前，项目会记录一条回退数据。

点击 `UndoButton` 后，会恢复最近一次移动。

支持连续多次回退，例如：

```text
1. 点击 ♦3
2. 点击 ♥A
3. 点击 ♠2
4. 点击回退：♠2 回主牌区
5. 点击回退：♥A 回备用牌区
6. 点击回退：♦3 回主牌区
7. 再点击回退：没有记录，不报错
```

---

## 5. 项目目录结构

```text
assets/
├── configs/
├── prefabs/
│   └── CardView.prefab
├── scenes/
│   └── Game.scene
├── scripts/
│   ├── configs/
│   │   └── CardResConfig.ts
│   ├── controllers/
│   │   └── GameTestController.ts
│   ├── managers/
│   │   └── UndoManager.ts
│   ├── models/
│   │   ├── CardEnums.ts
│   │   ├── CardModel.ts
│   │   ├── GameModel.ts
│   │   └── UndoModel.ts
│   ├── services/
│   │   └── MatchRuleService.ts
│   └── views/
│       ├── CardView.ts
│       └── GameView.ts
└── textures/

docs/
├── architecture.md
├── how-to-run.md
├── how-to-add-card.md
└── how-to-add-undo-type.md
```

---

## 6. 核心模块说明

### 6.1 configs

资源配置模块。

主要文件：

```text
CardResConfig.ts
```

负责配置卡牌显示需要的图片资源，包括：

* 卡牌正面底图
* 卡牌背面图
* 黑色大数字
* 红色大数字
* 黑色小数字
* 红色小数字
* 花色图

---

### 6.2 models

数据模型模块。

主要文件：

```text
CardEnums.ts
CardModel.ts
GameModel.ts
UndoModel.ts
```

职责：

* `CardEnums.ts`：定义花色、点数、区域、回退操作类型
* `CardModel.ts`：描述单张牌的数据
* `GameModel.ts`：管理当前游戏内所有卡牌数据
* `UndoModel.ts`：描述一条回退记录

---

### 6.3 views

视图模块。

主要文件：

```text
CardView.ts
GameView.ts
```

职责：

* `CardView.ts`：负责单张卡牌显示和点击回调
* `GameView.ts`：负责创建卡牌节点、刷新卡牌显示、播放移动动画

视图层不处理匹配规则，也不直接修改游戏数据。

---

### 6.4 controllers

控制器模块。

主要文件：

```text
GameTestController.ts
```

职责：

* 创建测试数据
* 接收卡牌点击
* 判断卡牌所在区域
* 调用匹配规则
* 调用视图移动卡牌
* 记录回退数据
* 处理 UndoButton 点击

---

### 6.5 services

规则服务模块。

主要文件：

```text
MatchRuleService.ts
```

职责：

* 判断主牌区卡牌是否可以和底牌顶部牌匹配
* 当前规则为点数相差 1 即可匹配

---

### 6.6 managers

管理器模块。

主要文件：

```text
UndoManager.ts
```

职责：

* 保存移动历史
* 提供 push / pop 操作
* 支持连续回退

---

## 7. MVC 分层说明

项目尽量按照 MVC 思路拆分：

```text
Model
负责保存游戏数据，不依赖 Cocos 节点。

View
负责显示和动画，不处理游戏规则。

Controller
负责流程控制，连接 Model、View、Service 和 Manager。

Service
负责独立规则判断。

Manager
负责通用状态管理，例如 Undo 栈。
```

这种结构的好处是：

* 数据和显示分离
* 规则和视图分离
* 回退逻辑可以独立维护
* 后续扩展新卡牌、新规则、新回退类型更方便

---

## 8. 功能验证流程

### 8.1 测试桌面牌匹配

初始状态：

```text
Tray：♣4
PlayField：♦3、♠2
Stack：♥A
```

操作：

```text
点击 ♠2
```

预期：

```text
♠2 不移动
因为 ♠2 和 ♣4 点数差 2
```

操作：

```text
点击 ♦3
```

预期：

```text
♦3 移动到底牌区
因为 ♦3 和 ♣4 点数差 1
```

---

### 8.2 测试备用牌替换底牌

操作：

```text
点击 ♥A
```

预期：

```text
♥A 从 Stack 移动到 Tray
♥A 成为新的底牌顶部牌
```

然后：

```text
点击 ♠2
```

预期：

```text
♠2 可以移动到 Tray
因为 ♠2 和 ♥A 点数差 1
```

---

### 8.3 测试连续回退

操作：

```text
1. 点击 ♦3
2. 点击 ♥A
3. 点击 ♠2
4. 点击 UndoButton
5. 再点击 UndoButton
6. 再点击 UndoButton
7. 再点击 UndoButton
```

预期：

```text
第 1 次回退：♠2 回到主牌区
第 2 次回退：♥A 回到备用牌区
第 3 次回退：♦3 回到主牌区
第 4 次回退：无记录，不报错
```

---

## 9. Git 开发流程

项目使用以下分支方式开发：

```text
main      稳定交付分支
develop   日常开发集成分支
feature/* 功能开发分支
```

功能完成后：

```text
feature/* -> develop -> main
```

推荐提交粒度：

```text
chore: 初始化项目配置
feat: 添加卡牌资源配置组件
feat: 创建卡牌 prefab
feat: 添加 MVC 数据模型
feat: 渲染测试卡牌
feat: 添加卡牌点击事件链路
feat: 添加桌面牌匹配移动逻辑
feat: 添加备用牌替换底牌逻辑
feat: 添加卡牌移动回退功能
docs: 添加项目说明文档
```

---

## 10. 后续扩展说明

### 10.1 如何新增卡牌

如果需要新增卡牌，可以查看：

```text
docs/how-to-add-card.md
```

主要涉及：

* 添加或替换卡牌图片资源
* 在 `CardResConfig` 中配置对应资源
* 保持点数数组顺序一致
* 保持花色数组顺序一致
* 在关卡数据或测试数据中添加新的 `CardModel`

点数顺序：

```text
A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K
```

花色顺序：

```text
clubs, diamonds, hearts, spades
```

---

### 10.2 如何新增回退类型

如果需要新增回退类型，可以查看：

```text
docs/how-to-add-undo-type.md
```

当前回退类型：

```text
MoveCard
```

未来可以扩展：

```text
FlipCard
DrawCards
ShuffleCards
```

扩展方式：

```text
1. 在 UndoOperationType 中新增类型
2. 扩展 UndoModel 或新增对应 Undo 数据结构
3. 在操作发生前记录 UndoModel
4. 在 Undo 处理逻辑中根据 operationType 分发恢复逻辑
```

---

## 11. 当前限制

当前 Demo 主要用于验证核心交互流程，因此仍有一些限制：

* 当前测试数据仍以代码方式创建
* 尚未完全接入关卡 JSON 配置
* 没有完整胜负判断
* 没有复杂发牌逻辑
* 没有完整音效和特效
* 没有正式 UI 面板流程

这些内容可以在后续版本继续扩展。

---

## 12. 版本说明

当前版本：

```text
v0.1.0-demo
```

已完成：

```text
卡牌显示
点击链路
主牌区匹配
备用牌替换
连续回退
基础 MVC 分层
```

```
