
import { File } from "@ionic-native/File";
import { Dataset } from "../models/Dataset";
export class DataSetService{
  
    wordDetailsFilename:String ='dataSetDetails';
    file:File=new File();
    getDataSetList(file:File):Promise<any>
    {
        
        return new Promise(function(resolve, reject) {
            var fileData:any;
            var dataSetDetails: Array<Dataset> = [];
            var error="";
            file.checkFile(file.dataDirectory, 'dataSetDetails').then(_ =>{
                console.log("file does  exist");
              
                file.readAsText(file.dataDirectory,'dataSetDetails').then(data=>{
                  console.log("read succ");
                  fileData=JSON.parse(data);
                  dataSetDetails=fileData.dataSetDetails;
                  resolve(dataSetDetails);
                  }).catch(err=>{
                    console.log("read unsecc Dataset array:"+dataSetDetails.length);
                    reject(dataSetDetails)
                
                  });
        
                }).catch(err=>{
                    console.log("file not exist Dataset array:"+dataSetDetails.length);
                    reject(dataSetDetails)
                });
                
        });
    }

    checkDataSetExist(dataSetDetails: Array<Dataset> ,DatasetObject:Dataset)
      {
        var exist : boolean = false;
        dataSetDetails.forEach(datasetObj=>{
          if(datasetObj.datasetId == DatasetObject.datasetId)
            exist=true;
        });
        return  exist;
      }

    addDataSettoFile(file:File,dataSetObj:Dataset,dataServiceObject:DataSetService):Promise<any>
    {
        return new Promise(function(resolve,reject ) {
            var fileData:any;
            var dataSetDetails: Array<Dataset> =[];
            var error:string ;
            dataServiceObject.getDataSetList(file).then(dataSetDetails=>{
                console.log("Dataset lencheck:"+dataSetDetails.length);
                     
                if(dataSetDetails.length>0)
                {
                    var exist= dataServiceObject.checkDataSetExist(dataSetDetails,dataSetObj)
                      console.log("Dataset exist: "+exist);
                      if(exist){
                      
                          error="Dataset already exist with : "+dataSetObj.datasetName;
                         resolve(error)
                      }
                      else{
                        
                        dataSetDetails.push(dataSetObj);
                        console.log("Number of Dataset added size:"+dataSetDetails.length)
                        
                        file.writeFile(file.dataDirectory,'dataSetDetails',JSON.stringify({ dataSetDetails: dataSetDetails }),{replace: true}).then(_=>{
                            console.log("write succ");
                            error=" Dataset added with id:"+dataSetObj.datasetId;
                            resolve(error)
                              }).catch(err=>{
                                console.log("write unsucc");
                                reject("write unsucc");
                              });
                      }
                     
                }
                else{
                    console.log("length not");
                    file.createFile(file.dataDirectory,'dataSetDetails',true).then( fileEntry=>{
                        console.log("file create");
                     
                        dataSetDetails.push(dataSetObj);  
                        
                        file.writeFile(file.dataDirectory,'dataSetDetails',JSON.stringify({ dataSetDetails: dataSetDetails }),{replace: true}).then(_=>{
                              console.log("file write succ");
                              error=" Dataset added with id:"+dataSetObj.datasetId;
                              console.log("size:"+dataSetDetails.length);
                              resolve(error)
                          }).catch(err=>{
                            console.log("file does not write");
                            reject("file does not write");
                          });
                    });
        
                }
                
            }).catch(err=>{
                console.log("Dataset get not workign "+dataSetDetails.length);
                file.createFile(file.dataDirectory,'dataSetDetails',true).then( fileEntry=>{
                    console.log("file create");
                    dataSetDetails.push(dataSetObj);  
                    file.writeFile(file.dataDirectory,'dataSetDetails',JSON.stringify({ dataSetDetails: dataSetDetails }),{replace: true}).then(_=>{
                          console.log("file write succ");
                          error=" Dataset added with id:"+dataSetObj.datasetId;
                          console.log("size:"+dataSetDetails.length);
                          resolve(error)
                      }).catch(err=>{
                        console.log("file does not write");
                        reject("file does not write");
                      });
                });
                   
            });
        });
               
    }


    removeDataSetFromFile(file:File,dataSetDetails: Array<Dataset>):Promise<any>
    {

        return new Promise(function(resolve,reject ) {
            file.writeFile(file.dataDirectory,'dataSetDetails',JSON.stringify({ dataSetDetails: dataSetDetails }),{replace: true}).then(_=>{
                console.log("file write succ");
                console.log("size:"+dataSetDetails.length);
                resolve("size:"+dataSetDetails.length);
            }).catch(err=>{
              console.log("file does not write");
              reject("file does not write");
            });
        });
               
    }

    removeDataSetFromArray(dataSetDetails: Array<Dataset> , datasetObj:Dataset )
    {
        var remove:boolean=false;
        const index: number = dataSetDetails.indexOf(datasetObj);
        if (index !== -1) {
            console.log("index:"+index);
            dataSetDetails.splice(index, 1);
            remove=true;
            return remove;
        } 
        for(let obj of dataSetDetails )
        {
            if(obj.datasetId==datasetObj.datasetId)
            {
                const index: number = dataSetDetails.indexOf(obj);
                if (index !== -1) {
                    console.log("index:"+index);
                    dataSetDetails.splice(index, 1);
                    remove=true;
                    return remove;
                } 
            }
        }
        return remove;
    }
}