import { WordData } from "./wordData";
import { methodInterventionWordData } from "./methodInterventionWordData";
import { MyMap } from "./myMap";

export class MethodSession{
    sessionIndex:number;//
    sessionDate:String=new Date().toISOString();//
    sessionCompletedTime:String; // completed seesions
    sessionWordDataList:Array<methodInterventionWordData>=[];// stores each words known time, total asked time.
    knownWordList:Array<WordData>=[];// shuffle known list
    unknownWordList:Array<WordData>=[];//total remaining unknown items
    sessionUnknownList:Array<WordData>=[];// unknown items for the session
    retentionWordList: MyMap =new MyMap();//previous session list
    controlItems:MyMap =new MyMap();//current unknownList
    totalOppurtunitiesToRespond:number=0;
    
}