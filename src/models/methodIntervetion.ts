import { MethodSession } from "./methodIntervetionSession";

export class Method{
    methodName:string;
    methodIndex:number=0;
    totalSessions:number=0;// total completed sessions
    sessionsArray:Array<MethodSession>=[];// number of sessions
    ratio1:number=0;
    ratio2:number=0;
    constructor(methodName:string,methodIndex:number)
    {
        this.methodName=methodName;
        this.methodIndex=methodIndex;
        if(methodIndex==0)
        {
            this.ratio1=7;
        }
        else if(methodIndex==1)
        {
            this.ratio1=8;
        }
        this.ratio2=4;
    }
}