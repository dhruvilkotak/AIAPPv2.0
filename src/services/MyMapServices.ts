import { WordData } from "../models/wordData";
import { MyMap } from "../models/myMap";

export class MyMApServices{
    removeObject(myMapObj:MyMap, key:WordData)
    {
        for(let obj of myMapObj.keys)
        {
            if(obj.wordId == key.wordId )
            {
                const index: number = myMapObj.keys.indexOf(obj);
                if (index !== -1) {
                    console.log("index:"+index);
                    myMapObj.keys.splice(index, 1);
                    myMapObj.values.splice(index, 1);
                    return ;
                } 
            }
        }
        return;
    }
    setObject(myMapObj:MyMap,key:WordData,value:boolean)
    {
        for(let obj of myMapObj.keys)
        {
            if(obj.wordId == key.wordId )
            {
                const index: number = myMapObj.keys.indexOf(obj);
                myMapObj.values[index] = value;
                return; 
            }
        }
        myMapObj.keys.push(key);
        myMapObj.values.push(value);
        return;
    }
    getValue(myMapObj:MyMap,key:WordData)
    {
        var valueTemp:boolean;
        for(let obj of myMapObj.keys)
        {
            if(obj.wordId == key.wordId )
            {
                const index: number = myMapObj.keys.indexOf(obj);
                valueTemp = myMapObj.values[index];
                //return myMapObj.values[index] 
                 break;
            }
        }
        return valueTemp;
    }
    clearMyMap(myMapObj:MyMap)
    {
        myMapObj.keys=[];
        myMapObj.values=[];
    }
    size(myMapObj:MyMap)
    {
        return myMapObj.keys.length || 0;
    }
    getKeys(myMapObj:MyMap)
    {
        return myMapObj.keys;
    }
    getValues(myMapObj:MyMap)
    {
        return myMapObj.values;
    }
    has(myMapObj:MyMap,key:WordData)
    {
        for(let obj of myMapObj.keys)
        {
            if(obj.wordId == key.wordId )
            {
                return true;
            }
        }
        return false;
    }

    printMyMap(myMapObj:MyMap)
    {
        var i:number=0;
        while(i<myMapObj.keys.length)
        {
            console.log("key:"+myMapObj.keys[i].wordText+" value:"+myMapObj.values[i]);
            i++;
        }
        return;
    }
}