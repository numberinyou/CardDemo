# 新增回退类型说明

## 1. 当前回退功能

当前只支持一种回退类型：

```text
UndoOperationType.MoveCard
```

对应场景：

```text
PlayField -> Tray
Stack -> Tray
```

每次移动前，控制器会创建一条 `UndoModel`：

```text
movedCardId
fromArea
toArea
fromPosition
toPosition
operationType
```

点击 UndoButton 后：

```text
UndoManager.pop()
↓
根据 UndoModel 恢复 CardModel
↓
GameView 播放移动动画
```

## 2. 当前文件职责

```text
UndoOperationType:
    定义回退操作类型

UndoModel:
    保存一次回退记录

UndoManager:
    管理回退记录栈

GameTestController:
    在移动前记录 Undo
    在点击 UndoButton 时恢复
```

## 3. 新增回退类型的步骤

假设后续要新增“翻牌回退”，例如：

```text
某张覆盖牌被翻开
Undo 后需要重新盖回去
```

推荐按以下步骤做。

---

## 3.1 扩展 UndoOperationType

修改：

```text
assets/scripts/models/CardEnums.ts
```

新增：

```ts
export enum UndoOperationType {
    None = -1,
    MoveCard = 0,
    FlipCard = 1,
    NumUndoOperationTypes = 2,
}
```

---

## 3.2 扩展 UndoModel

当前 UndoModel 主要记录移动数据。

为了支持更多类型，可以增加可选字段：

```text
targetCardId
fromFaceDown
toFaceDown
```

例如：

```ts
public targetCardId?: string;
public fromFaceDown?: boolean;
public toFaceDown?: boolean;
```

也可以更进一步，把不同回退类型拆成不同接口或子类，但当前 Demo 阶段用一个 UndoModel 加可选字段即可。

---

## 3.3 记录翻牌操作

当某张牌从盖住变成翻开前，先记录：

```ts
const undoRecord = new UndoModel({
    operationType: UndoOperationType.FlipCard,
    movedCardId: cardModel.id,
    fromArea: cardModel.area,
    toArea: cardModel.area,
    fromPosition: cardModel.position.clone(),
    toPosition: cardModel.position.clone(),
});

undoRecord.fromFaceDown = true;
undoRecord.toFaceDown = false;

this.undoManager.push(undoRecord);
```

然后再真正修改：

```ts
cardModel.isFaceDown = false;
```

并刷新视图。

---

## 3.4 在 Undo 处理中分发

当前 Undo 逻辑可能类似：

```ts
if (undoRecord.operationType !== UndoOperationType.MoveCard) {
    console.warn('unsupported undo operation');
    return;
}
```

扩展后建议改成 switch：

```ts
switch (undoRecord.operationType) {
    case UndoOperationType.MoveCard:
        this.undoMoveCard(undoRecord);
        break;

    case UndoOperationType.FlipCard:
        this.undoFlipCard(undoRecord);
        break;

    default:
        console.warn('[GameController] unsupported undo operation.');
        break;
}
```

---

## 3.5 新增 undoFlipCard

示例：

```ts
private undoFlipCard(undoRecord: UndoModel): void {
    if (!this.gameModel || !this.gameView) {
        return;
    }

    const cardModel = this.gameModel.getCardById(undoRecord.movedCardId);

    if (!cardModel) {
        return;
    }

    cardModel.isFaceDown = undoRecord.fromFaceDown ?? cardModel.isFaceDown;

    this.gameView.refreshCard(cardModel);
}
```

如果当前 GameView 还没有 `refreshCard(cardModel)`，可以新增一个方法，根据 CardModel 重新调用 CardView 的显示接口。

## 4. 新增多张牌移动回退

如果后续有“一次移动多张牌”的需求，不建议用多条 MoveCard 分散记录。

建议新增：

```text
UndoOperationType.MoveCards
```

然后 UndoModel 支持：

```text
movedCards: Array<{
    cardId
    fromArea
    toArea
    fromPosition
    toPosition
}>
```

Undo 时一次性恢复所有牌。

## 5. 新增发牌回退

如果后续要支持发牌操作：

```text
从牌库发多张牌到 PlayField 或 Stack
```

推荐新增：

```text
UndoOperationType.DealCards
```

记录：

```text
dealtCardIds
fromArea
toArea
fromPositions
toPositions
```

Undo 时把这些牌移回原区域，或从 GameModel 中移除。

## 6. Undo 设计原则

新增回退类型时遵守以下原则：

```text
1. 操作前记录，不要操作后记录。
2. UndoModel 只记录恢复需要的数据。
3. UndoManager 只负责 push / pop，不处理业务。
4. Controller 负责根据 operationType 分发。
5. GameView 只负责表现恢复动画或刷新显示。
6. 不要在 CardView 里写 Undo 逻辑。
```

