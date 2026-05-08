# 程序设计文档

## 1. 架构目标

项目采用接近 MVC 的分层结构，将数据、视图、控制逻辑、规则服务和管理器拆开，避免所有逻辑集中在一个脚本中。

目标：

```text
models 只保存数据
views 只负责显示和输入回调
controllers 协调模型、视图和业务流程
managers 管理有状态的功能，例如 Undo
services 提供无状态业务能力，例如匹配规则、关卡转模型
configs 管理静态配置和配置加载
utils 提供独立工具函数和常量
```

这样后续新增卡牌、关卡、回退类型或 UI 表现时，可以在明确的模块内修改。

## 2. 模块职责

### 2.1 configs

路径：

```text
assets/scripts/configs/
```

职责：

```text
静态配置、资源配置、关卡配置结构和加载逻辑。
```

当前文件：

```text
CardResConfig.ts
models/LevelConfig.ts
loaders/LevelConfigLoader.ts
```

说明：

- `CardResConfig.ts`：保存卡牌正面、背面、大数字、小数字、花色 SpriteFrame。
- `LevelConfig.ts`：定义 JSON 关卡结构。
- `LevelConfigLoader.ts`：从 `assets/resources` 加载关卡 JSON。

### 2.2 models

路径：

```text
assets/scripts/models/
```

职责：

```text
保存运行时动态数据，不包含复杂业务逻辑。
```

当前文件：

```text
CardEnums.ts
CardModel.ts
GameModel.ts
UndoModel.ts
```

说明：

- `CardEnums.ts`：定义卡牌点数、花色、区域、Undo 操作类型。
- `CardModel.ts`：表示一张运行时卡牌。
- `GameModel.ts`：保存整局游戏的卡牌数据。
- `UndoModel.ts`：表示一条可回退操作记录。

### 2.3 views

路径：

```text
assets/scripts/views/
```

职责：

```text
负责 UI 展示和用户输入捕获，不写业务规则。
```

当前文件：

```text
CardView.ts
GameView.ts
```

说明：

- `CardView.ts`：显示一张牌，捕获点击后回调 cardId。
- `GameView.ts`：实例化 CardView，刷新卡牌显示，播放移动动画。

### 2.4 controllers

路径：

```text
assets/scripts/controllers/
```

职责：

```text
协调 Model、View、Service、Manager，处理用户操作流程。
```

当前文件：

```text
GameTestController.ts
```

说明：

当前仍命名为 `GameTestController`，但它已经承担正式 GameController 的职责：

```text
加载关卡
生成 GameModel
初始化 GameView
处理卡牌点击
处理 Stack 翻牌
处理 PlayField 匹配
记录 Undo
响应 UndoButton
```

后续可单独重命名为 `GameController.ts`。

### 2.5 managers

路径：

```text
assets/scripts/managers/
```

职责：

```text
管理有状态的功能，作为 controller 成员使用，禁止单例。
```

当前文件：

```text
UndoManager.ts
```

说明：

`UndoManager` 管理 UndoModel 栈，提供 push、pop、clear 等接口。

### 2.6 services

路径：

```text
assets/scripts/services/
```

职责：

```text
提供无状态业务能力，不持有运行时数据生命周期。
```

当前文件：

```text
MatchRuleService.ts
GameModelFromLevelGenerator.ts
```

说明：

- `MatchRuleService.ts`：判断 PlayField 牌是否能和 Tray 顶部牌匹配。
- `GameModelFromLevelGenerator.ts`：将 LevelConfig 转换为 GameModel。

### 2.7 utils

路径：

```text
assets/scripts/utils/
```

职责：

```text
存放通用常量和工具函数，不涉及具体业务流程。
```

当前文件：

```text
GameLayoutConst.ts
PositionConvertUtil.ts
```

说明：

- `GameLayoutConst.ts`：保存设计分辨率、Stack / Tray 位置、Stack 横向叠牌偏移。
- `PositionConvertUtil.ts`：把关卡设计坐标转换为 Cocos UI 坐标。

## 3. 关键数据结构

### 3.1 CardModel

表示一张运行时卡牌。

主要字段：

```text
id          唯一 ID
face        点数
suit        花色
area        当前区域：PlayField / Stack / Tray
position    当前逻辑位置
isFaceDown  是否盖住
```

### 3.2 GameModel

表示整局游戏运行时数据。

主要职责：

```text
保存所有 CardModel
按区域查询卡牌
获取 Stack 顶部牌
获取 Tray 顶部牌
移动卡牌到指定区域
更新卡牌位置
```

### 3.3 UndoModel

表示一次可回退操作。

主要字段：

```text
operationType
movedCardId
fromArea
toArea
fromPosition
toPosition
```

## 4. 游戏初始化流程

```text
GameTestController.start()
↓
startGame()
↓
LevelConfigLoader.loadLevelConfig(levelConfigPath)
↓
GameModelFromLevelGenerator.generate(levelConfig)
↓
生成 GameModel
↓
GameView.setCardClickCallback(...)
↓
GameView.renderGame(gameModel)
↓
玩家开始操作
```

## 5. 卡牌点击流程

```text
用户点击 CardView
↓
CardView 捕获 TOUCH_END
↓
CardView 调用 clickCallback(cardId)
↓
GameView.handleCardClicked(cardId)
↓
GameView 转发给 GameTestController
↓
GameTestController 根据 card.area 分发处理
```

分发逻辑：

```text
PlayField:
    判断是否能匹配 Tray 顶部牌

Stack:
    判断是否是 Stack 顶部牌，是则移动到 Tray

Tray:
    当前不处理
```

## 6. PlayField 匹配流程

```text
点击 PlayField 牌
↓
获取 Tray 顶部牌
↓
MatchRuleService.canMatchWithTrayTop(...)
↓
如果点数差 1:
    记录 Undo
    更新 GameModel
    调用 GameView.moveCardToPosition(...)
否则:
    不移动
```

## 7. Stack 翻牌流程

```text
点击 Stack 牌
↓
确认它是 Stack 顶部牌
↓
获取 Tray 顶部牌位置
↓
记录 Undo
↓
将 Stack 顶部牌 area 改为 Tray
↓
移动到 Tray 位置
↓
该牌成为新的 Tray 顶部牌
```

## 8. Undo 回退流程

```text
点击 UndoButton
↓
UndoManager.pop()
↓
如果没有记录:
    输出 no undo record
↓
如果有记录:
    找到 movedCardId 对应的 CardModel
    恢复 fromArea
    恢复 fromPosition
    GameView 播放移动回原位置
```

## 9. Stack 横向叠牌布局

当前 Stack 布局规则：

```text
Stack 在左侧
Tray 在右侧
Stack 底层牌在左边
越上层越向右
顶部牌在最右边
每张牌向右偏移约半张牌宽
```

相关常量：

```text
GameLayoutConst.StackBasePosition
GameLayoutConst.StackVisibleOffsetX
GameLayoutConst.StackVisibleOffsetY
```

## 10. 扩展边界说明

当前 Demo 暂未实现复杂遮挡关系和自动翻牌。若后续要支持“消除上方牌后，下方覆盖牌翻开”，建议新增：

```text
CardModel.blockingCardIds
CardModel.coveredByCardIds
CoverRuleService
```

不要把覆盖判断写在 CardView 中。
