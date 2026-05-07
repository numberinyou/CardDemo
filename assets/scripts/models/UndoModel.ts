import { Vec3 } from 'cc';
import { CardAreaType, UndoOperationType } from './CardEnums';

export class UndoModel {
    public operationType: UndoOperationType;
    public movedCardId: string;
    public fromArea: CardAreaType;
    public toArea: CardAreaType;
    public fromPosition: Vec3;
    public toPosition: Vec3;

    public constructor(params: {
        operationType: UndoOperationType;
        movedCardId: string;
        fromArea: CardAreaType;
        toArea: CardAreaType;
        fromPosition: Vec3;
        toPosition: Vec3;
    }) {
        this.operationType = params.operationType;
        this.movedCardId = params.movedCardId;
        this.fromArea = params.fromArea;
        this.toArea = params.toArea;
        this.fromPosition = params.fromPosition;
        this.toPosition = params.toPosition;
    }
}