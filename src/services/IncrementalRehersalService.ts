import { WordData } from "../models/wordData";
import { MethodSession } from "../models/methodIntervetionSession";
import { PreSessionResultTest } from "../models/PreSessionAssessmentResultTest";
import { MyMap } from "../models/myMap";
import { MyMApServices } from "./MyMapServices";
import { methodInterventionWordData } from "../models/methodInterventionWordData";

export class IncrementalRehersalService
{
    private ratio1:number=7;
    private ratio2:number=4;
    private methodKnownWordList:Array<WordData>=[];
    private methodUnKnownWordList:Array<WordData>=[];
    private myMapServiceObject:MyMApServices=new MyMApServices();
    startSessionTest(methodSessionObject:MethodSession,ratio1:number,ratio2:number)
    {
        
        var knownWordList:Array<WordData>=methodSessionObject.knownWordList;
        var unknownWordList:Array<WordData>=methodSessionObject.unknownWordList;
        var methodInetrventionWordDataArray:Array<methodInterventionWordData>=methodSessionObject.sessionWordDataList;
        var testWordArray:Array<WordData>=[];
        var counter:number=0;
        var k:number=0;
     
        //   knownWordList=this.shuffle(knownWordList);
        //temp unknown list
        let ukMap:MyMap=new MyMap();
        console.log("known Array:");
        this.printList(knownWordList);
        console.log("unknown Array:");
        this.printList(unknownWordList);
        if(this.ratio2>unknownWordList.length)
            return;
        for(let unknownWordObj of unknownWordList)
        {
            if(this.ratio2<=0)
            {
                break;
            }        
            console.log("set:"+(k+1));
            console.log("taking unknown:"+unknownWordObj.wordText);
         //   methodSessionObject.sessionUnknownList.push(unknownWordObj);
            let i:number=0;
            while(i<this.ratio1)
            {
                console.log("uu :"+unknownWordObj.wordText);
                testWordArray.push(unknownWordObj);
                this.updateWordDataToMethodIntevention(unknownWordObj,methodInetrventionWordDataArray,false);
           
                counter++;
                let j=0;
                let wordObjIterator:Array<WordData> = Array.from(ukMap.keys);
                wordObjIterator.reverse();

                for(let wordItem of wordObjIterator)
                {
                    if(j<=i)
                    {
                        console.log("uk :"+wordItem.wordText);
                        testWordArray.push(wordItem);
                        this.updateWordDataToMethodIntevention(wordItem,methodInetrventionWordDataArray,false);
           
                        counter++;
                        j++;
                    }
                    else{
                        break;
                    }
                }
                while(j<=i)
                {
                    console.log("kk :"+knownWordList[j].wordText);
                    testWordArray.push(knownWordList[j]);
                    this.updateWordDataToMethodIntevention(knownWordList[j],methodInetrventionWordDataArray,true);
           
                    counter++;
                    j++;
                }
                console.log("counter:"+counter);  
                i++; 
            }
            console.log("Removing "+unknownWordObj.wordText+" from and putting in known as K"+unknownWordObj.wordText);
            this.myMapServiceObject.setObject(ukMap,unknownWordObj,true);
            this.ratio2--;
            k++;
        }
        console.log("temp list:");
        this.printList(testWordArray);
        
      //  methodSessionObject.controlItems=ukMap;    
      methodSessionObject.sessionWordDataList=methodInetrventionWordDataArray;
        return testWordArray;
    }


    shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

   
   

    printList(wordList:Array<WordData>){
        for(let wordDataObj of wordList)
        {
            console.log(" "+wordDataObj.wordText);
        }
    }
    compareAssessment(uk1Map:MyMap,uk2Map:MyMap,preSessionWordDataArray:Array<PreSessionResultTest>){
        //retrun known array list
        var tempUkList:Array<WordData>=[];
        var truekwy:Array<WordData>=[];
        console.log(" Compare Test :  uk1:"+(this.myMapServiceObject.size(uk1Map))+"  uk2:"+this.myMapServiceObject.size(uk2Map));

        console.log("retention:"+uk1Map.values);
        console.log("control:"+uk2Map.values);
    
    

        for(let wordDatauk1Obj of uk1Map.keys)
        {
            if(!this.myMapServiceObject.has(uk2Map, wordDatauk1Obj))
            {
                tempUkList.push(wordDatauk1Obj);
                var preSessionWordDataObj:PreSessionResultTest= new PreSessionResultTest();
                preSessionWordDataObj.wordData=wordDatauk1Obj;
                preSessionWordDataObj.isKnownWord=false;
                preSessionWordDataObj.test1Known=this.myMapServiceObject.getValue(uk1Map ,wordDatauk1Obj);
                preSessionWordDataObj.test2Known=false;
                preSessionWordDataObj.notes=wordDatauk1Obj.wordText+" :"+this.myMapServiceObject.getValue(uk1Map ,wordDatauk1Obj)+"  null  keeping in unknown list";
                preSessionWordDataArray.push(preSessionWordDataObj);
                console.log(wordDatauk1Obj.wordText+" :"+this.myMapServiceObject.getValue(uk1Map, wordDatauk1Obj)+"  "+this.myMapServiceObject.getValue(uk2Map,wordDatauk1Obj)+" keeping in unknown list");

            }
            else{
                if(this.myMapServiceObject.getValue(uk1Map, wordDatauk1Obj) == this.myMapServiceObject.getValue(uk2Map,wordDatauk1Obj) )
                {
                    if(!this.myMapServiceObject.getValue(uk1Map,wordDatauk1Obj))
                    {
                        tempUkList.push(wordDatauk1Obj);
                        let preSessionWordDataObj:PreSessionResultTest= new PreSessionResultTest();
                        preSessionWordDataObj.wordData=wordDatauk1Obj;
                        preSessionWordDataObj.isKnownWord=false;
                        preSessionWordDataObj.test1Known=false;
                        preSessionWordDataObj.test2Known=false;
                        preSessionWordDataObj.notes=wordDatauk1Obj.wordText+" :"+this.myMapServiceObject.getValue(uk1Map ,wordDatauk1Obj)+"  "+this.myMapServiceObject.getValue(uk2Map,wordDatauk1Obj)+" keeping in unknown list";
                        preSessionWordDataArray.push(preSessionWordDataObj);
                        console.log(wordDatauk1Obj.wordText+" :"+this.myMapServiceObject.getValue(uk1Map, wordDatauk1Obj)+"  "+this.myMapServiceObject.getValue(uk2Map, wordDatauk1Obj)+" keeping in unknown list");
                    }
                    else{
                        let preSessionWordDataObj:PreSessionResultTest= new PreSessionResultTest();
                        preSessionWordDataObj.wordData=wordDatauk1Obj;
                        preSessionWordDataObj.isKnownWord=true;
                        preSessionWordDataObj.test1Known=true;
                        preSessionWordDataObj.test2Known=true;
                        preSessionWordDataObj.notes=wordDatauk1Obj.wordText+" :"+this.myMapServiceObject.getValue(uk1Map, wordDatauk1Obj)+"  "+this.myMapServiceObject.getValue(uk2Map, wordDatauk1Obj)+" removing from unknown list";
                        preSessionWordDataArray.push(preSessionWordDataObj);
                      
                        console.log(wordDatauk1Obj+" :"+this.myMapServiceObject.getValue(uk1Map,wordDatauk1Obj)+"  "+this.myMapServiceObject.getValue(uk2Map,wordDatauk1Obj)+" removing from unknown list");
                        truekwy.push(wordDatauk1Obj);
                    }
                }
                else{
                    tempUkList.push(wordDatauk1Obj);
                    let preSessionWordDataObj:PreSessionResultTest= new PreSessionResultTest();
                    preSessionWordDataObj.wordData=wordDatauk1Obj;
                    preSessionWordDataObj.isKnownWord=false;
                    preSessionWordDataObj.test1Known=this.myMapServiceObject.getValue(uk1Map, wordDatauk1Obj);
                    preSessionWordDataObj.test2Known=this.myMapServiceObject.getValue(uk2Map, wordDatauk1Obj);
                    preSessionWordDataObj.notes=wordDatauk1Obj.wordText+" :"+this.myMapServiceObject.getValue(uk1Map, wordDatauk1Obj)+"  "+this.myMapServiceObject.getValue(uk2Map, wordDatauk1Obj)+" keeping in unknown list";
                    preSessionWordDataArray.push(preSessionWordDataObj);
                  
                    console.log(wordDatauk1Obj.wordText+" :"+this.myMapServiceObject.getValue(uk1Map, wordDatauk1Obj)+"  "+this.myMapServiceObject.getValue(uk2Map, wordDatauk1Obj)+" keeping in unknown list");
                }
            }
        }
        for(let wordDatauk2Obj of uk2Map.keys)
        {
            if(!this.myMapServiceObject.has(uk1Map, wordDatauk2Obj))
            {
                //index =-1 element not exist
                console.log("index:"+tempUkList.indexOf(wordDatauk2Obj));
                if(tempUkList.indexOf(wordDatauk2Obj)<0)
                {
                    let preSessionWordDataObj:PreSessionResultTest= new PreSessionResultTest();
                    preSessionWordDataObj.wordData=wordDatauk2Obj;
                    preSessionWordDataObj.isKnownWord=false;
                    preSessionWordDataObj.test1Known=false;
                    preSessionWordDataObj.test2Known=this.myMapServiceObject.getValue(uk2Map, wordDatauk2Obj);
                    preSessionWordDataObj.notes=wordDatauk2Obj.wordText+" : null  "+this.myMapServiceObject.getValue(uk2Map, wordDatauk2Obj)+" keeping in unknown list";
                    preSessionWordDataArray.push(preSessionWordDataObj);
                  
                    tempUkList.push(wordDatauk2Obj);
                }
                console.log(wordDatauk2Obj.wordText+" :null  "+this.myMapServiceObject.getValue(uk2Map, wordDatauk2Obj)+" keeping in unknown list");
            }
        }
        // for(let wordDatatruekwy of truekwy)
        // {
        //     this.myMapServiceObject.removeObject(uk1Map, wordDatatruekwy);
        //     this.myMapServiceObject.removeObject(uk2Map, wordDatatruekwy);
        // }
        console.log(" tempukk:"+tempUkList.length+"  presession:"+preSessionWordDataArray.length);        
        return preSessionWordDataArray;
    }
    
    removeWordDataItem(originalList:Array<WordData>,tempList:Array<WordData>)
    {
        for(let wordDataObj of tempList)
        {
            const index: number = originalList.indexOf(wordDataObj);
            if (index !== -1) {
                console.log("index:"+index);
                originalList.splice(index, 1);
            }
        }
    }

    addWordDataItem(originalList:Array<WordData>,tempList:Array<WordData>)
    {
        for(let wordDataObj of tempList)
        {
            originalList.push(wordDataObj);
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
} 