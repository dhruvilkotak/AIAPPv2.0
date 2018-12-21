import { File } from "@ionic-native/file";
import { Platform } from "ionic-angular";
import { DocumentPicker } from "@ionic-native/document-picker";
import { WordData } from "../models/wordData";
import * as firebase from 'firebase';
import { WordServices } from "../services/wordServices";

export class WordDataFireBaseDao{
    
  
    importWordDataFile(file:File ,plt:Platform,docPicker:DocumentPicker,wordDataArray:Array<WordData>):Promise<any>
    {
        return new Promise(function(resolve, reject)
        {
           // var studentFireBaseDao:StudentFireBaseDao = new StudentFireBaseDao();
           var wordServiceObject:WordServices= new WordServices();

           if (plt.is('ios'))
             {

               docPicker.getFile('all').then(uri => 
                {

                    let path=uri.substr(0,uri.lastIndexOf('/')+1);
                    let filename=uri.substring(uri.lastIndexOf('/')+1);
                    console.log("url:"+uri);
                    console.log("path:"+path);
                    console.log("filename:"+filename);

                   
                    file.readAsText(path,filename).then(result=>
                    {
                        var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
                      
                        console.log("result:"+result);
                        var allLines= result.split('\r');
                        console.log("res:"+result.split('\r').length+"  resl:"+result.split('\r'));
                        console.log("alllines:"+allLines.length+"  0:"+allLines[0])

                        //allLines.splice(0, 1);
                        var c1:number=1;
                        while(c1<allLines.length)
                        {
                            //var lineObj=allLines[c1];
                            var wordArray= allLines[c1].split(",");
                            console.log("wordArray:"+wordArray);
                      
                            if(wordArray.length>1)
                            {
                                var wordObj:WordData = new WordData();
                                console.log("uuid1:"+wordObj.wordId)
                                if(wordArray[0] != null && wordArray[0].replace(/\s/g, "").toLowerCase.length>3)
                                {
                                    console.log("wordArray[0]:("+wordArray[0]+")")
                                    wordObj.wordId=wordArray[0];   
                                }
                                console.log("uuid2:"+wordObj.wordId)
                                wordObj.wordText=wordArray[1];
                                wordObj.wordCategory=wordArray[2];
                                console.log("wordData:"+wordObj.wordId+" "+wordObj.wordText+"  "+wordObj.wordCategory);
                                var exist= wordServiceObject.checkWordExist(wordDataArray,wordObj);
                                console.log("WordData exist: "+exist);
                                if(exist ){
                                
                                    var error="WordData already exist with : "+wordObj.wordText;
                                   console.log(""+error);
                                }
                                else{
                                    wordDataFireBaseDao.addWordDataArrayToDataSet(wordDataArray,wordObj);              
                                    
                                }

                            }

                            c1++;
                        }
                      
                    }).catch(err=>{
                        reject("file read prb:"+err);
                    });

                }).catch(e => {
                    console.log(e);
                    reject("file uri prob:"+e);
                });
            }

        });
            
    }

    removeWordData(wordDataObject:WordData)
    {
        console.log("student firebase removed:"+wordDataObject.wordText);
        let databaseRef = firebase.database().ref('WordDataList/'+wordDataObject.wordCategory+'/'+wordDataObject.wordId+'/');
        databaseRef.remove();
        databaseRef.off();
        return;
    }

    addWordDataArrayToDataSet(wordDataList:Array<WordData>,wordDataObj:WordData)
    {
        var category:String=wordDataObj.wordCategory;
        let databaseRef = firebase.database().ref('WordDataList/'+category+'/');
        var query=databaseRef.orderByChild('wordText').equalTo(""+wordDataObj.wordText);
        query.on('value',function(snapshot){
            console.log("childern:",snapshot.toJSON);
            if(snapshot.hasChildren())
            {

                snapshot.forEach(function(childSnapshot) {

                    var key = childSnapshot.key;
                   var childData = childSnapshot.val();
                 
                     //this will be the actual email value found
                      console.log("word text:"+childData.wordText);
               });
            }
            else{
                let newInfo = databaseRef.push();
                wordDataObj.wordId=newInfo.key;
                newInfo.set(wordDataObj);
                wordDataList.push(wordDataObj);
            }
            query.off();
            return;

        });
    }
    addWordData(wordDataObj:WordData)
    {

        var category:String=wordDataObj.wordCategory;
        let databaseRef = firebase.database().ref('WordDataList/'+category+'/');
        var query=databaseRef.orderByChild('wordText').equalTo(""+wordDataObj.wordText);
        query.on('value',function(snapshot){
            console.log("childern:",snapshot.toJSON);
            if(snapshot.hasChildren())
            {

                snapshot.forEach(function(childSnapshot) {

                    var key = childSnapshot.key;
                   var childData = childSnapshot.val();
                 
                     //this will be the actual email value found
                      console.log("word text:"+childData.wordText);
               });
            }
            else{
                let newInfo = databaseRef.push();
                wordDataObj.wordId=newInfo.key;
                newInfo.set(wordDataObj);
            }
            query.off();
            return;
        });    
    }

    addExistWordData(wordDataObject:WordData,WordDataArray:Array<WordData>)
    {
        let databaseRef = firebase.database().ref('WordDataList/');

            var query=databaseRef.orderByChild('wordText').equalTo(""+wordDataObject.wordText);
            query.on('value',function(snapshot){
                console.log("childern:",snapshot.toJSON);
                if(snapshot.hasChildren())
                {
                }
                else{
                   this.addWordData(wordDataObject);
                }
                query.off();
                return;
            }); 
        
    }

    exportWordDataFireBase(wordDataFileArrayList:Array<WordData>,wordDataArray:Array<WordData>)
    {
        for(let wordDataObj of wordDataFileArrayList)
        {
            this.addExistWordData(wordDataObj,wordDataArray);
        }  
       
    }

    importWordFile(file:File ,plt:Platform,docPicker:DocumentPicker,wordDetailsArray:Array<WordData>):Promise<any>
    {
        return new Promise(function(resolve, reject)
         {
            
            if (plt.is('ios'))
             {

               docPicker.getFile('all').then(uri => 
                {

                    let path=uri.substr(0,uri.lastIndexOf('/')+1);
                    let filename=uri.substring(uri.lastIndexOf('/')+1);
                    console.log("url:"+uri);
                    console.log("path:"+path);
                    console.log("filename:"+filename);

                   
                    file.readAsText(path,filename).then(result=>
                    {
                        var wordDataFileArray:Array<WordData> = [];
                        console.log("result:"+result);
                        var allLines= result.split('\r');
                        console.log("res:"+result.split('\r').length+"  resl:"+result.split('\r'));
                        console.log("alllines:"+allLines.length+"  0:"+allLines[0])

                        //allLines.splice(0, 1);
                        var c1:number=1;
                        while(c1<allLines.length)
                        {
                            //var lineObj=allLines[c1];
                            var wordArray= allLines[c1].split(",");
                            console.log("wordArray:"+wordArray);
                      
                            if(wordArray.length>1)
                            {
                                var wordObj:WordData = new WordData();
                                console.log("uuid1:"+wordObj.wordId)
                                if(wordArray[0] != null && wordArray[0].replace(/\s/g, "").toLowerCase.length>3)
                                {
                                    console.log("wordArray[0]:("+wordArray[0]+")")
                                    wordObj.wordId=wordArray[0];   
                                }
                                console.log("uuid2:"+wordObj.wordId)
                                wordObj.wordText=wordArray[1];
                                wordObj.wordCategory=wordArray[2];
                                console.log("wordData:"+wordObj.wordId+" "+wordObj.wordText+"  "+wordObj.wordCategory);
                                wordDataFileArray.push(wordObj);
                            }
                            c1++;
                        }
                        this.exportWordDataFireBase(wordDataFileArray,wordDetailsArray);
                        
                    }).catch(err=>{
                        reject("file read prb:"+err);
                    });

                }).catch(e => {
                    console.log(e);
                    reject("file uri prob:"+e);
                });
            }
           
        });
    }

  
    getWordList():Promise<any>
    {
        return new Promise(function(resolve, reject) {
              
            let databaseRef = firebase.database().ref('WordDataList/');
            databaseRef.on('value',function(snapshot){
                var wordDataArray: Array<WordData> = [];
                if(snapshot.hasChildren())
                {
                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key;
                        
                        if(childSnapshot.hasChildren)
                        {
                            childSnapshot.forEach(function(grandChildSnapShot){
                                var key2 = grandChildSnapShot.key;
                                var wordDataObject = grandChildSnapShot.val();
                                console.log(" student text:"+wordDataObject+" key:"+key);
                                 wordDataArray.push(wordDataObject);
                            });
                        }
                       
                   });
                   resolve(wordDataArray);
                   databaseRef.off();
                }
                else{
                 resolve(wordDataArray);
                    databaseRef.off();
                }    
                databaseRef.off();
                return;
            });
            
        });
    }
}