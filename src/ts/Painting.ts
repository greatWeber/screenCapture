import utils from "./utils";

/**
 * 绘画 -- 类 (模拟拖拽及确定大小位置)
 */
interface params {
    target: HTMLElement,
    dragingCb: Function,
    dragEndCb: Function,
    drawingCb: Function,
    drawEndCb: Function,
}
class Painting {
    private target: HTMLElement; //绘画的对象
    private dragingCb: Function; //拖拽中的回调
    private dragEndCb: Function; //拖拽结束的回调

    private drawingCb: Function; //绘画中的回调
    private drawEndCb: Function; //绘画结束的回调

    private startX: number = 0;
    private startY: number = 0;
    private lastX: number = 0;
    private lastY: number = 0;
    private rangeX: number = 0;
    private rangeY: number = 0;

    private _dragStartHandler: EventListenerOrEventListenerObject;
    private _dragingHandler: EventListenerOrEventListenerObject;
    private _dragEndHandler: EventListenerOrEventListenerObject;

    private _drawStartHandler: EventListenerOrEventListenerObject;
    private _drawingHandler: EventListenerOrEventListenerObject;
    private _drawEndHandler: EventListenerOrEventListenerObject;

    constructor(params: params){ 
        this.target = params.target;
        this.dragingCb = params.dragingCb;
        this.dragEndCb = params.dragEndCb;
        this.drawingCb = params.drawingCb;
        this.drawEndCb = params.drawEndCb;
    }

    /**
     * 初始化拖拽事件
     */
    public initDrag():void {
       
        this.onDragStart();
    }

    private setCursor(attr: string){
        this.target.style.cursor = attr;
    }

    /**
     * 拖拽 start
     */
    public onDragStart():void {
        let _this=  this;
        this._dragStartHandler = this.dragStartHandler.bind(this);
        this.target.addEventListener('mousedown',this._dragStartHandler,false);
        
    }

    private dragStartHandler():void {
        console.log(arguments);
        let e: any = arguments[0];
        e.stopPropagation();
        this.setCursor('move');
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.onDraging();
        this.onDragEnd();
    } 

    /**
     * 拖拽中
     * @param dragingCb 
     */
    public onDraging():void {
        let _this = this;
        this.setCursor('move');
        this._dragingHandler = this.dragingHandler.bind(this);
        this.target.addEventListener('mousemove',this._dragingHandler, false);
    }

    private dragingHandler():void {
        let e: any = arguments[0];
        e.stopPropagation();
        let throttleCb :Function = utils.throttle(this.dragingCb,10);
        this.rangeX = e.clientX - this.startX + this.lastX;
        this.rangeY = e.clientY - this.startY + this.lastY;
        throttleCb(this.rangeX,this.rangeY);
    }

    /**
     * 拖拽结束
     */
    public onDragEnd():void {
        this._dragEndHandler = this.dragEndHandler.bind(this);
        this.target.addEventListener('mouseup',this._dragEndHandler, false);
        this.target.addEventListener('mouseleave',this._dragEndHandler, false);
        
    }

    private dragEndHandler():void{
        let e: any = arguments[0];
        this.lastX = this.rangeX;
        this.lastY = this.rangeY;
        this.target.removeEventListener('mousemove',this._dragingHandler,false);
        this.target.removeEventListener('mouseup',this._dragEndHandler,false);
        this.dragEndCb();
    }

    // ========================================
    /**
     * 初始化绘画事件
     */
    public initDraw():void {
        this.onDrawStart();
    }

    /**
     * 开始绘画
     */
    public onDrawStart():void {
        this.setCursor('crosshair');
        this._drawStartHandler = this.drawStartHandler.bind(this);
        this.target.addEventListener('mousedown',this._drawStartHandler,false);
    }

    private drawStartHandler():void {
        let e: any = arguments[0];
        e.stopPropagation();
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.onDrawing();
        this.onDrawEnd();
    }

    /**
     * 绘画中
     */
    public onDrawing():void {
        this._drawingHandler = this.drawingHandler.bind(this);
        this.target.addEventListener('mousemove',this._drawingHandler,false);
    }

    private drawingHandler():void {
        let e: any = arguments[0];
        e.stopPropagation();
        this.rangeX = e.clientX - this.startX;
        this.rangeY = e.clientY - this.startY;
        // debugger;
        let throttleCb: Function = utils.throttle(this.drawingCb,10);
        throttleCb(this.rangeX,this.rangeY,this.startX,this.startY);
    }

    /**
     * 绘画结束
     */
    public onDrawEnd():void {
        this._drawEndHandler = this.drawEndHandler.bind(this);
        this.target.addEventListener('mouseup',this._drawEndHandler,false);
    }

    private drawEndHandler():void {
        this.target.removeEventListener('mousemove',this._drawingHandler,false);
        this.target.removeEventListener('mouseup',this._drawEndHandler,false);
        this.drawEndCb(this.startX,this.startY);
    }


}

export default Painting;