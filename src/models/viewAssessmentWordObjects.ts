import { WordData } from "./wordData";
import { UUID } from "angular2-uuid";

export class ViewAssessmentWordObjects
{
    assessmentWordObjectId:UUID;
    wordData:WordData;
    testArrayKnown:Array<boolean>=[];
    stringKnownArray:Array<String>=[];
    totalKnownTime:number=0;
    totalTest:number=0;
    wordAdded:boolean=false;
    wordType:String="";
    constructor()
    {
        this.assessmentWordObjectId=UUID.UUID();
    }

}