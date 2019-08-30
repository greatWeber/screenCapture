/**
 * 核心类 -- 连接UI.js和Canvas.js
 */

import UI from './UI';
import Canvas from './Canvas';
import Painting from './Painting';
import utils from './utils';

// 配置参数
interface options {
    copyType?: string,
    keyCode?: number|string,
    fkeyCode?: number|string,
}

export default class ScreenCapture {
    private options:options;
    private UIInstance: UI; //ui实例
    private DragInstance: Painting; //拖拽实例
    private DrawInstance: Painting; //绘画实例
    private CanvasInstance: Canvas; //canvas实例

    private width: number = 0;
    private height: number = 0;
    private offsetX: number = 0;
    private offsetY: number = 0;

    constructor(options:options){
        this.options = Object.assign({
            copyType: 'all',
            keyCode: 66, //b
            fkeyCode: 77, //m
        },options) ; 
    }

    /**
     * 公开的init方法
     */
    public init():void {
        this.initUI();
        this.initDrag();
        this.initDraw();
        this.initCanvas();

        this.initEvents();
    }

    /**
     * 初始化UI类
     */
    private initUI():void {
        this.UIInstance = new UI(); 
        this.UIInstance.initUI(utils.uuid()); 
    }

    /**
     * 初始化拖拽实例
     */
    private initDrag():void {
        this.dragingCb = this.dragingCb.bind(this);
        this.dragEndCb = this.dragEndCb.bind(this);
        this.DragInstance = new Painting({
            target: this.UIInstance.UITarget.numberTarget,
            dragingCb: this.dragingCb,
            dragEndCb: this.dragEndCb
        });
        this.DragInstance.initDrag();
    }

    /** 
     * 拖拽中的回调
     */
    private dragingCb(x:number,y:number):void {
        this.UIInstance.setViewLayout(this.width,this.height,x,y);
    }

    /**
     * 拖拽结束后的回调 
     */
    private dragEndCb(x:number,y:number):void {
        this.offsetX = x;
        this.offsetY = y;
        this.UIInstance.showFunctionView(this.width,this.height,x,y);
    }

    /**
     * 初始化绘画类
     */
    private initDraw():void {
        this.drawingCb = this.drawingCb.bind(this);
        this.drawEndCb = this.drawEndCb.bind(this);
        this.DrawInstance = new Painting({
            target: this.UIInstance.UITarget.maskTarget,
            drawingCb: this.drawingCb,
            drawEndCb: this.drawEndCb
        });
        this.DrawInstance.initDraw();
    }

    /**
     * 绘画中的回调
     */
    private drawingCb(w:number,h:number,x:number,y:number):void {
        this.width = w;
        this.height = h;
        this.UIInstance.setViewLayout(w,h,x,y);
    }

    /**
     * 绘画结束后的回调
     */
    private drawEndCb(x:number,y:number):void {
        this.offsetX = x;
        this.offsetY = y;
        this.UIInstance.showFunctionView(this.width,this.height,x,y);

        this.DragInstance.setScreenSize({
            width: this.width,
            height: this.height,  
            clientW: this.UIInstance.UITarget.maskTarget.clientWidth,
            clientH: this.UIInstance.UITarget.maskTarget.clientHeight,
            offsetX: x,
            offsetY: y
        })
    }

    /**
     * 初始化canvas
     */
    private initCanvas():void {
        this.CanvasInstance = new Canvas({
            minHeight: this.UIInstance.UITarget.maskTarget.clientHeight,
            copyType: this.options.copyType,
            UITarget: this.UIInstance.UITarget,
            UI: this.UIInstance
        })
    }

    /**
     * 初始化事件
     */
    private initEvents():void {

        this.keydownHandler();
        this.captureSureHandler();
        this.captureCloseHandler();
        this.stopMouseDown();
        this.closePopupHandler();
        this.popupDownloadHandler();
    }

    /**
     * 监听键盘事件  
     */
    private keydownHandler():void{
        document.addEventListener('keydown',(e)=>{
            console.log(e);
            
            let ctrl = e.ctrlKey || e.metaKey;
            let keyCode = e.keyCode ||e.which || e.charCode;
            this.normalScreenCapture(ctrl,keyCode,e);
            this.fullScreenCapture(ctrl,keyCode,e);
            this.stopScreenCapture(keyCode,e);
        },false)
    }

    /**
     * 普通的截图
     * @param ctrl 
     * @param keyCode 
     * @param e 
     */
    private normalScreenCapture(ctrl: boolean, keyCode: number,e:any):void{
        // ctrl+b
        if(ctrl&&keyCode == this.options.keyCode){
            // 显示蒙层
            e.preventDefault();
            this.UIInstance.showMask();
        }
    }

    /**
     * 全屏截图
     * @param ctrl 
     * @param keyCode 
     * @param e 
     */
    private fullScreenCapture(ctrl: boolean, keyCode: number,e:any):void {
        // ctrl+n
        if(ctrl&&keyCode == this.options.fkeyCode){
            // 显示蒙层
            e.preventDefault();
            this.CanvasInstance.capture({
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                offsetX:0,
                offsetY: 0
            })
        }
    }

    /**
     * 停止截图
     * @param keyCode 
     * @param e 
     */
    private stopScreenCapture(keyCode:number,e:any):void {
        if(keyCode == 27) {
            e.stopPropagation();
            this.UIInstance.hidePopup();
            this.UIInstance.hideMask();
            this.UIInstance.hideViewLayout();

        }
    }

    /**
     * 点击确认截图
     */
    private captureSureHandler():void {
        this.UIInstance.UITarget.captureSure.addEventListener('click',(e)=>{
            this.UIInstance.hideMask();
            this.UIInstance.hideViewLayout();
            this.CanvasInstance.capture({
                width: this.width,
                height: this.height,
                offsetX:this.offsetX,
                offsetY: this.offsetY
            })
        },false)
    }

    /**
     * 取消截图
     */
    private captureCloseHandler():void {
        this.UIInstance.UITarget.captureClose.addEventListener('click',(e)=>{
            e.stopPropagation();
            this.UIInstance.hideMask();
            this.UIInstance.hideViewLayout();
        },false);

    }

    /**
     * 这里添加一个mousedown，是为了阻止触发父级的mousedown事件
     */
    private stopMouseDown():void {
        this.UIInstance.UITarget.functionView.addEventListener('mousedown',(e)=>{
            e.stopPropagation();
            return false;
        },false)
    }

    /**
     * 点击关闭弹窗
     */
    private closePopupHandler():void {
        this.UIInstance.UITarget.popupCloseTarget.addEventListener('click',(e)=>{
            this.UIInstance.hidePopup();
            this.UIInstance.hideMask();
            this.UIInstance.hideViewLayout();
        })
    }

    /**
     * 弹窗点击下载
     */
    private popupDownloadHandler():void {
        this.UIInstance.UITarget.popupDownloadTarget.addEventListener('click',(e)=>{

            this.CanvasInstance.downloadCopy();
            this.UIInstance.hidePopup();
            this.UIInstance.hideMask();
            this.UIInstance.hideViewLayout();
        })
    }


}