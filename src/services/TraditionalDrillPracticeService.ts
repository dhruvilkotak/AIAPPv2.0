import { MethodSession } from "../models/methodIntervetionSession";
import { WordData } from "../models/wordData";
import { methodInterventionWordData } from "../models/methodInterventionWordData";
import { ArrayService } from "./arrayService";

export class TraditionalDrillPracticeService{
    private arrayService:ArrayService=new ArrayService();

    getWorDataList(methodSessionObject:MethodSession,ratio2:number)
    {
        var unknownWordList:Array<WordData>=methodSessionObject.unknownWordList;
        var testWordArray:Array<WordData>=[];
        var unknownWordCropList:Array<WordData>=[];
        var methodInetrventionWordDataArray:Array<methodInterventionWordData>=methodSessionObject.sessionWordDataList;
        var counter:number=0;

        console.log("unknown Array:"+ratio2+"  a:"+unknownWordList.length);
        if(ratio2>unknownWordList.length)
            return;
        while(counter<ratio2)
        {
            console.log("unknown:"+unknownWordList[counter].wordText);
            unknownWordCropList.push(unknownWordList[counter++]);
        }
        console.log("unknown size:"+unknownWordCropList.length);
        counter=1;
        var lastWord;
        while(counter<=35)
        {
            var i:number=0;
            while(i<ratio2)
            {
                this.updateWordDataToMethodIntevention(unknownWordCropList[i],methodInetrventionWordDataArray,false);
                testWordArray.push(unknownWordCropList[i++]);
            }
            lastWord=testWordArray[(counter*ratio2)-1];
            this.arrayService.shuffle(unknownWordCropList);
            //first last word not same
            while(lastWord.wordId==unknownWordCropList[0].wordId)
            {
                this.arrayService.shuffle(unknownWordCropList);    
            }
            counter++;
        }
        console.log("total words:"+testWordArray.length);
        methodSessionObject.sessionWordDataList=methodInetrventionWordDataArray;
        return testWordArray;
    }


    updateWordDataToMethodIntevention(wordDataObject:WordData,methodInetrventionWordDataArray:Array<methodInterventionWordData>,isKnown:boolean)
    {
        var methodInterventionWordDataObj:methodInterventionWordData= this.getMethodSessionWordDataObject(wordDataObject, methodInetrventionWordDataArray);
        if(methodInterventionWordDataObj==null)
        {
          methodInterventionWordDataObj=new methodInterventionWordData();
          methodInterventionWordDataObj.wordData=wordDataObject;
          methodInterventionWordDataObj.isKnownWord=isKnown;
          methodInetrventionWordDataArray.push(methodInterventionWordDataObj);
        }
    }

    getMethodSessionWordDataObject(wordDataObject:WordData,methodInetrventionWordDataArray:Array<methodInterventionWordData>)
    {
      for(let obj of methodInetrventionWordDataArray)
      {
        if(obj.wordData.wordId == wordDataObject.wordId)
        {
          return obj;
        }
      }
      return null;
    }
}