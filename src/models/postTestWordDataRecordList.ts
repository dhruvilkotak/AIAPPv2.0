import { KnownUnknownWordData } from "./knownUnknownWordData";
import { PostTestWordData } from "./PostTestWordData";

export class PostTestWordDataRecordList{
    
    postTestWordDataArray:Array<PostTestWordData>=[];
    subTestCompleted:number=0;
    maxTest:number=3;
    knownCounterArray:Array<number>=[0,0,0];
    consistancyPercentageArray:Array<number>=[0,0,0];
     

}