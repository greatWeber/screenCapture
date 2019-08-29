/**
 * 绘制canvas
 * 需要借助html2canvas
 */
interface sizeInfo {
    width: number,
    height: number;
    offsetX: number,
    offsetY: number,
}

interface params {
    minHeight: number,
    copyType: string, //裁剪后的类型操作: all=弹窗；_blank=新窗口打开；download=直接下载
    UITarget: any
}
//  import html2canvas from '../../node_modules/html2canvas/dist/types/index';
//  import html2canvas from 'html2canvas';
const html2canvas = (window as any).html2canvas
 console.log(html2canvas);   

 class Canvas {
    private params: params; 
    private canvas: HTMLCanvasElement;
    private size: sizeInfo;
    constructor(params: params){
        this.params = params;
        
        

    }

    public capture(size:sizeInfo):void{
        /**
         * todo:
         * 1. 设置宽高，特别是高度最小是100vh
         * 2. 用html2canvas获取页面截图
         * 3. 通过宽高及偏移切边
         * 4. 再转成图片
         */
        this.size = size;
        // todo1:
        let height = document.body.clientHeight;
        if(height<this.params.minHeight){
            document.body.style.height = '100vh';
        }
        // todo2:
        html2canvas(document.body,{
            width: document.body.clientWidth,
            height: document.body.clientHeight,
        }).then(canvas=>{
            this.canvas = canvas;
            // document.body.appendChild(canvas);
            let imgData = this.canvas.toDataURL();

            // todo3:
            this.drawImage(imgData);
        })
    }

    /**
     * 切片
     * @param img 
     */
    private drawImage(img: string):void {
        let ctx = this.canvas.getContext('2d');
        let size = this.size;
        let image = new Image();
        image.src = img;
        image.onload = ()=>{
            this.canvas.width = size.width;
            this.canvas.height = size.height;
            ctx.drawImage(image,size.offsetX,size.offsetY,size.width,size.height,0,0,size.width,size.height);

            this.copySwitch(); 
        }
    }
    /**
     * 保存的方式
     */
    private copySwitch():void{
        console.log(this.params.copyType);
        switch(this.params.copyType){
            case 'all':
            break;
            case '_blank':
                this.blankCopy();
            break;
            case 'download':
                this.downloadCopy();
            break;

        }
    }

    /**
     * 新窗口打开
     */
    private blankCopy():void{

        let windowImage = new Image();
        windowImage.src = this.canvas.toDataURL();
        const newWindow = window.open('','_blank'); //直接新窗口打开
        newWindow.document.write(windowImage.outerHTML);
    }

    /**
     * 直接下载
     */
    public downloadCopy():void{
        let downloadTarget = this.params.UITarget.downloadTarget;
        downloadTarget.href = this.canvas.toDataURL();
        downloadTarget.download = new Date().getTime() +'.png';
        downloadTarget.click();
    }

    
 }

 export default Canvas;