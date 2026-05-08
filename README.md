# 卡牌 Demo 项目说明

## 1. 项目目标

本项目实现一个简化版纸牌匹配 Demo，用于验证以下核心玩法：

1. 主牌区牌与底牌堆顶部牌按点数差 1 进行匹配。
2. 备用牌堆顶部牌可移动到底牌堆，成为新的底牌顶部牌。
3. 支持移动操作的连续回退。
4. 支持通过关卡 JSON 初始化牌局。
5. 代码结构尽量遵循 MVC 分层，提升可维护性和后续扩展能力。

当前实现基于 Cocos Creator TypeScript 工程。原需求中的架构思想参考 MVC 分层，包括 configs、models、views、controllers、managers、services、utils 等模块。

## 2. 当前核心功能

### 2.1 主牌区匹配

点击主牌区 PlayField 中翻开的牌时，会和底牌堆 Tray 顶部牌进行点数匹配。

匹配规则：

```text
abs(playfieldCard.face - trayTopCard.face) === 1
```

花色不参与判断。

例如：

```text
Tray 顶部牌是 ♣4
点击 ♦3 可以匹配
点击 ♠2 不可以匹配
```

### 2.2 备用牌堆翻牌

备用牌堆 Stack 位于左侧，底牌堆 Tray 位于右侧。

点击 Stack 顶部牌后，该牌会移动到 Tray 顶部牌位置，并成为新的 Tray 顶部牌。

Stack 中多张牌横向叠放：

```text
底层牌在左侧
越上层越向右
顶部牌在最右侧
下方牌露出约半个牌面，便于看到下一张牌数字
```

### 2.3 回退功能

每次卡牌移动前，系统会记录一条 UndoModel。

点击 UndoButton 时，会按后进先出的顺序恢复最近一次移动：

```text
点击 ♦3 -> 点击 ♥A -> 点击 ♠2
Undo 1: ♠2 回原位置
Undo 2: ♥A 回 Stack
Undo 3: ♦3 回 PlayField
Undo 4: 无记录，不报错
```

### 2.4 关卡配置初始化

关卡配置文件位置：

```text
assets/resources/configs/levels/level_001.json
```

运行时通过 LevelConfigLoader 加载 JSON，再由 GameModelFromLevelGenerator 转换为 GameModel。

## 3. 推荐项目结构

```text
assets/
├── resources/
│   └── configs/
│       └── levels/
│           └── level_001.json
│
├── prefabs/
│   └── CardView.prefab
│
├── scenes/
│   └── Game.scene
│
├── scripts/
│   ├── configs/
│   │   ├── CardResConfig.ts
│   │   ├── loaders/
│   │   │   └── LevelConfigLoader.ts
│   │   └── models/
│   │       └── LevelConfig.ts
│   │
│   ├── controllers/
│   │   └── GameTestController.ts
│   │
│   ├── managers/
│   │   └── UndoManager.ts
│   │
│   ├── models/
│   │   ├── CardEnums.ts
│   │   ├── CardModel.ts
│   │   ├── GameModel.ts
│   │   └── UndoModel.ts
│   │
│   ├── services/
│   │   ├── GameModelFromLevelGenerator.ts
│   │   └── MatchRuleService.ts
│   │
│   ├── utils/
│   │   ├── GameLayoutConst.ts
│   │   └── PositionConvertUtil.ts
│   │
│   └── views/
│       ├── CardView.ts
│       └── GameView.ts
```

## 4. 快速运行

1. 打开 `assets/scenes/Game.scene`。
2. 确认 `CardResConfigNode` 上已绑定卡牌资源。
3. 确认 `GameViewNode` 上已绑定：
   - CardLayer
   - CardView.prefab
   - CardResConfig
4. 确认 `GameControllerNode` 上已绑定：
   - GameView
   - UndoButton
   - Level Config Path: `configs/levels/level_001`
5. 运行场景。

## 5. 当前交付状态

当前 Demo 已覆盖：

```text
关卡配置加载
GameModel 生成
主牌区匹配
备用牌移动到底牌
移动动画
连续回退
Stack 横向叠放露出下一张数字
```

暂未完整实现：

```text
复杂覆盖牌依赖关系
消除上方牌后自动翻开下方牌
胜利 UI 弹窗
失败判定
存档恢复
```

这些能力可在当前架构下继续扩展。
