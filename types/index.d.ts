export interface DragMoveConfig {
    targetEl: HTMLElement;
    rootDom?: Document;
    limitMoveBorder?: boolean;
    moveMode?: 'transform' | 'position';
    h5?: boolean;
    disableMoveEl?: boolean;
    maxMoveX?: number;
    maxMoveY?: number;
}
