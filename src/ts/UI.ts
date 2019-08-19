// UI集合

import utils from './utils';

class UI {
    public UITarget: any;
    private maskTarget: HTMLElement; //蒙层的element对象
    private selectTarget: HTMLElement; //可拖拽选择框对象
    private numberTarget: HTMLElement; //宽高数据显示区
    private uuid: Number;
    constructor(){}

    /**
     * 初始化UI界面
     */
    public initUI(uuid:Number):void{
        this.uuid = uuid;
        this.createWrapper();
        this.createSelectBox();
        this.createNumberView();
    }

    /**
     * 创建蒙层
     */
    private createWrapper():void {
        this.maskTarget = document.querySelector(`.screenCapture-${this.uuid}`);
        if(this.maskTarget) return;
        this.maskTarget = document.createElement('div');
        this.maskTarget.className = `screenCapture-wrapper screenCapture-${this.uuid}`;
        document.body.appendChild(this.maskTarget);
 
    }

    /**
     * 创建选择框对象
     */
    private createSelectBox():void {
        this.selectTarget = this.maskTarget.querySelector('.screenCapture-selectbox');
        if(this.selectTarget) return;
        this.selectTarget = document.createElement('div');
        utils.Class(this.selectTarget,'add','screenCapture-selectbox');
        this.maskTarget.appendChild(this.selectTarget);
        
    }

    /**
     * 创建宽高数据显示区
     */
    private createNumberView():void{
        this.numberTarget = this.maskTarget.querySelector('.screenCapture-number-view');
        if(this.numberTarget) return;
        this.numberTarget = document.createElement('div');
        utils.Class(this.numberTarget,'add','screenCapture-number-view');
        this.maskTarget.appendChild(this.numberTarget);
    }



}