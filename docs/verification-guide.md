# 验证与交付检查清单

## 1. 场景配置检查

打开：

```text
assets/scenes/Game.scene
```

检查节点：

```text
Canvas
├── BgGame
├── CardLayer
├── UILayer
│   └── UndoButton
├── CardResConfigNode
├── GameViewNode
└── GameControllerNode
```

## 2. 组件绑定检查

### 2.1 CardResConfigNode

需要挂载：

```text
CardResConfig
```

资源数组顺序：

```text
blackBigNumberFrames: A-K
redBigNumberFrames: A-K
blackSmallNumberFrames: A-K
redSmallNumberFrames: A-K
suitFrames: Clubs, Diamonds, Hearts, Spades
```

### 2.2 GameViewNode

需要挂载：

```text
GameView
```

字段：

```text
cardLayer: CardLayer
cardViewPrefab: CardView.prefab
cardResConfig: CardResConfigNode/CardResConfig
```

### 2.3 GameControllerNode

需要挂载：

```text
GameTestController
```

字段：

```text
levelConfigPath: configs/levels/level_001
gameView: GameViewNode/GameView
undoButtonNode: UILayer/UndoButton
```

## 3. 功能验证

### 3.1 关卡初始化

运行后 Console 应输出类似：

```text
game started from level config
all cards count
playfield count
stack count
tray count
```

画面应显示：

```text
PlayField 主牌区
左侧 Stack 备用牌堆
右侧 Tray 底牌堆
```

### 3.2 Stack 备用牌

验证：

```text
Stack 在左侧
底层牌在左边
上层牌在右边
能露出下方牌约半个牌面
顶部牌可点击
非顶部牌不应优先移动
```

### 3.3 PlayField 匹配

验证：

```text
点数差 1 可以移动
点数不差 1 不移动
花色不影响匹配
```

### 3.4 Stack 到 Tray

验证：

```text
点击 Stack 顶部牌
该牌移动到右侧 Tray
该牌成为新的 Tray 顶部牌
```

### 3.5 Undo

验证：

```text
点击可移动的 PlayField 牌
点击 Stack 顶部牌
连续点击 Undo
卡牌按反向顺序回到原位置
无记录时点击 Undo 不报错
```

