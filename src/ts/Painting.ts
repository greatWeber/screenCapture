import utils from "./utils";

/**
 * 绘画 -- 类 (模拟拖拽及确定大小位置)
 */
interface params {
    target: HTMLElement,
    dragingCb: Function,
    dragEndCb: Function
}
class Drag {
    private target: HTMLElement; //绘画的对象
    private dragingCb: Function; //拖拽中的回调
    private dragEndCb: Function; //拖拽结束的回调

    constructor(params: params){ 
        this.target = params.target;
        this.dragingCb = params.dragingCb;
        this.dragEndCb = params.dragEndCb;
    }

    /**
     * 初始化事件
     */
    public initEvent():void {
        this.target.setAttribute('draggable','true');
        this.onDrag();
    }

    /**
     * 拖拽
     */
    public onDrag(dragingCb?: Function):void {
        this.target.addEventListener('drag',dragHandler,false);
        let _this=  this;
        function dragHandler(e: any){
            console.log(_this);
            let callback :Function = _this.dragingCb || dragingCb;
          
            let throttleCb :Function = utils.throttle(callback,10);
            throttleCb(e.pageX,e.pageY);
        }
    }
}

export default Drag;