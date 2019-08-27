import utils from "./utils";

/**
 * 绘画 -- 类 (模拟拖拽及确定大小位置)
 */
interface params {
    target: HTMLElement,
    dragingCb: Function,
    dragEndCb: Function
}
class Painting {
    private target: HTMLElement; //绘画的对象
    private dragingCb: Function; //拖拽中的回调
    private dragEndCb: Function; //拖拽结束的回调
    private startX: number = 0;
    private startY: number = 0;
    private lastX: number = 0;
    private lastY: number = 0;
    private rangeX: number = 0;
    private rangeY: number = 0;
    private _dragStartHandler: EventListenerOrEventListenerObject;
    private _dragingHandler: EventListenerOrEventListenerObject;
    private _dragEndHandler: EventListenerOrEventListenerObject;

    constructor(params: params){ 
        this.target = params.target;
        this.dragingCb = params.dragingCb;
        this.dragEndCb = params.dragEndCb;
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

}

export default Painting;