// UI集合

import utils from './utils';

class UI {
    public UITarget: any;
    private maskTarget: HTMLElement; //蒙层的element对象
    private selectTarget: HTMLElement; //可拖拽选择框对象
    private numberTarget: HTMLElement; //宽高数据显示区
    private functionView: HTMLElement; //功能显示区
    private imgTarget: HTMLImageElement; //隐藏的img标签
    private uuid: number;
    constructor(){}

    /**
     * 初始化UI界面
     */
    public initUI(uuid:number):void{
        this.uuid = uuid;
        this.createWrapper();
        this.createSelectBox();
        this.createHideImg();
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

        this.functionView = document.createElement('div');
        utils.Class(this.functionView,'add','screenCapture-selectbox');

        this.functionView.innerHTML = `
                <p class="screenCapture-w-h i-b v-m">
                    <span class="screenCapture-w">0</span> x 
                    <span class="screenCapture-h">0</span>
                </p>
                <p class="screenCapture-function i-b v-m">
                    <span class="function-item function-doodling v-m">涂鸦</span>
                    <img alt="取消" class="function-close v-m" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAnUlEQVRIie3UMQ6FMAgG4C509gJwdbmRbvRNepO6vTybYMHi8BL/tZAvJNCU3vxNtilNjwOFYPkgzJZ6QWBr7QkolGuhXHvNgsDWWrXxqrmtEwQ2IxZoGOhBYYAGFcpbKHABxQJfiPLeThQLKJO4VtYDtBMNQ9oWWe/oNqC9uyHrHQxBv829NT1BCKvr9xYEtt6BILAbuJPHgTehOQCS9eOOOnME1QAAAABJRU5ErkJggg==" >
                    <img alt="完成" class="function-success v-m" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAuElEQVRIie3QwQ3CMAwF0IyQC1LsUy5U9o1RugEdgREYhQ1gA7pBR6HXWJXMBUFBBAIk4tD+87eebWPmTCY4VDUIHZ1QUwRwQg0KKworCLVFARTW7JdMALDqrRNaW/W2CGCMMSDUXgrdp1Dyi1BoNyomQyC8uc1Rj0NVR8tWvR1doyjcOSX/CrhfjPqFLFcpiz1edIoNfg2kQj8D76BsQAyCwPusQATKDzyHCgBXKNAWAh+KAXP+kjOxSufHfawyfwAAAABJRU5ErkJggg==" >
                </p>
        `;
        this.numberTarget.appendChild(this.functionView);
        this.maskTarget.appendChild(this.numberTarget);
        this.setUITarget();
    }

    /**
     * 创建隐藏的img标签
     */
    private createHideImg():void {
        this.imgTarget = document.querySelector('.sccreenCapture-hide-img');
        if(this.imgTarget) return;
        this.imgTarget = document.createElement('img');
        utils.Class(this.imgTarget,'add','sccreenCapture-hide-img');

        document.body.appendChild(this.imgTarget);
    }

    /**
     * 设置UITarget
     */
    public setUITarget():void{
        this.UITarget= {
            maskTarget: this.maskTarget,
            selectTarget: this.selectTarget,
            numberTarget: this.numberTarget,
            functionView: this.functionView,
            captureWidth: this.numberTarget.querySelector('.screenCapture-w'),
            captureHeight: this.numberTarget.querySelector('.screenCapture-h'),
            captureSure: this.numberTarget.querySelector('.function-success'),
            captureClose: this.numberTarget.querySelector('.function-close'),
            captureDoodling: this.numberTarget.querySelector('.function-doodling'),
            imgTarget: this.imgTarget
        }
    }

    /**
     * 显示蒙层
     */
    public showMask():void {
        utils.Class(this.maskTarget,'add','screenCapture-wrapper-show');
    }

    /**
     * 隐藏蒙层
     */
    public hideMask():void {
        utils.Class(this.maskTarget,'del','screenCapture-wrapper-show');
    }

    /**
     * 显示信息功能区
     * @param width 
     * @param height 
     * @param x 
     * @param y 
     * 
     */
    public showFunctionView(width:number,height:number,x:number,y:number):void {
        /**
         * todo:
         * 1. 给 numberTarget设置宽高和位置
         * 2. 显示 functionView
         * 3. 判断functionView的位置有没有超出
         * 4. 显示宽高参数
         */
        if(width<=0 || height<=0) return; //目前只支持左->右，上->下设置位置和宽高
        //todo1:
        this.numberTarget.style.cssText = `
            width:${width}px;
            height: ${height}px;
            transform: translate(${x}px,${y}px);
        `;
        // todo2:
        utils.Class(this.functionView,'add','screenCapture-selectbox-show');
        // todo3:
        let offsetWidth: number = this.functionView.offsetWidth;
        let offsetHeight: number = this.functionView.offsetHeight;
        if(offsetWidth>x){
            this.functionView.style.left='0px';
        }
        // console.log(offsetHeight+y,this.maskTarget.offsetHeight)
        if(offsetHeight+y>=this.maskTarget.offsetHeight){
            this.functionView.style.top = '0px';
        } 
        // todo4:
        this.UITarget.captureWidth.innerText = width;
        this.UITarget.captureHeight.innerText = height;
    }

    /**
     * 设置几何信息(位置和大小)
     * @param width 
     * @param height 
     * @param x 
     * @param y 
     */
    public setViewLayout(width:number,height:number,x:number,y:number):void {
        if(width<=0 || height<=0) return; //目前只支持左->右，上->下设置位置和宽高
        this.numberTarget.style.cssText = `
            width:${width}px;
            height: ${height}px;
            transform: translate(${x}px,${y}px);
        `;
    }

    /**
     * 隐藏选择框
     */
    public hideViewLayout(){
        this.numberTarget.style.cssText = `
            width:0px;
            height: 0px;
            transform: translate(-999px,-999px);
        `;
    }


}

export default UI; 