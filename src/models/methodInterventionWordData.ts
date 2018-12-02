import { WordData } from "./wordData";

export class methodInterventionWordData{
    //ir method 
    wordData:WordData;
     isKnownWord:boolean;
     totalAskedTime:number=0;
     knownTime:number=0;
     //di method
     drillmode:boolean=false;
     drillmodeKnownCounter:number=0;
}