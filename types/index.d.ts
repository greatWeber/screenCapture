declare class ScreenCapture {
    constructor(options:options);

    init():void;

}

 interface options {
    copyType?: string,
    keyCode?: number|string,
    fkeyCode?: number|string,
}

export default ScreenCapture;