export default {
    /**
     * css class 操作
     * @param target 对象
     * @param op 添加(add)， 删除(del)， 包含(has)， 等于(eq), 切换(tog)， 替换(rep)
     * @param className 
     * @param oldClass 
     */
    Class(target: any,op:String='add',className?:String,oldClass?:String):any{
        let result: any;
        switch(op){
            case 'add':
                target.classList.add(className);
            break;
            case 'del':
                target.classList.remove(className);
            break;
            case 'has':
                result = target.classList.contains(className);
            break;
            case 'eq':
                target.className = className;
            break;
            case 'tog': //ie10以下不支持
                target.classList.toggle(className);
            break;
            case 'rep': //safari不支持
                target.classList.replace(oldClass,className);
            break;
        }
    }
}