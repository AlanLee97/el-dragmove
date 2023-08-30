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
    private initConfig;
    private initTragetElInfo;
    private getStyleTransformProp;
    private calcTargetTranlate;
    private setTransformProp;
    private translateMoveEl;
    private topLeftMoveTargetEl;
    private mousemoveHandler;
    private mousedownHandler;
    private mouseupHandler;
    private initEvent;
    destroy(): void;
}
