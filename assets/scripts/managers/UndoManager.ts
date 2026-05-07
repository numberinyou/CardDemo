import { UndoModel } from '../models/UndoModel';

export class UndoManager {
    private undoStack: UndoModel[] = [];

    public push(record: UndoModel): void {
        this.undoStack.push(record);
    }

    public pop(): UndoModel | null {
        if (this.undoStack.length === 0) {
            return null;
        }

        return this.undoStack.pop() ?? null;
    }

    public hasRecords(): boolean {
        return this.undoStack.length > 0;
    }

    public clear(): void {
        this.undoStack.length = 0;
    }

    public getCount(): number {
        return this.undoStack.length;
    }
}