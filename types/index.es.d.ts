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
/**
 * 拖动模型
 * */
export default class DragMoveModel {
    startX: number;
    startY: number;
    moveInsX: number;
    moveInsY: number;
    isMousedown: boolean;
    targetEl: any;
    targetElTx: number;
    targetElTy: number;
    initTargetElTop: number;
    initTargetElLeft: number;
    limitMoveBorder: boolean;
    moveMode: string;
    callback: any;
    h5: boolean;
    disableMoveEl: boolean;
    maxMoveX: number;
    maxMoveY: number;
    rootDom: Document;
    constructor(config?: DragMoveConfig, callback?: () => void);
    _initConfig(config: DragMoveConfig): void;
    _initTragetElInfo(): void;
    _getStyleTransformProp(transform?: string, prop?: string): string;
    _calcTargetTranlate: () => void;
    _setTransformProp(transform?: string, prop?: string, value?: string): string;
    _translateMoveEl(): void;
    _topLeftMoveTargetEl: () => void;
    _mousemoveHandler: (e: any) => void;
    _mousedownHandler: (e: any) => void;
    _mouseupHandler: (e: any) => void;
    _initEvent(): void;
    destroy(): void;
}
