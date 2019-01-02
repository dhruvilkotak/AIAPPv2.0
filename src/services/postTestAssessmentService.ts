import { Student } from "../models/student";
import { KnownUnknownWordData } from "../models/knownUnknownWordData";
import { PostTestWordData } from "../models/PostTestWordData";
import { PostTestWordDataRecordList } from "../models/postTestWordDataRecordList";
import { PostTestAssessmentDao } from "../dao/PostTestAssessmentDao";
import { Storage } from "@ionic/storage";

export class PostTestAssessmentService{
    
    getPostTestWordDataArrayFromWordData(wordDataArray:Array<KnownUnknownWordData>)
    {
        var postTestWordDataArray:Array<PostTestWordData>=[];
        for(let wordObj of wordDataArray)
        {
            var postTestWordDataObject = new PostTestWordData();
            postTestWordDataObject.wordData=wordObj.wordData;
            postTestWordDataArray.push(postTestWordDataObject);
        }
        return postTestWordDataArray;
    }

    addPostTestWordDataRecordListObject(studentObject:Student,testIndex:number){
        var postTestAssessmentDao:PostTestAssessmentDao = new PostTestAssessmentDao();
        postTestAssessmentDao.addPostTestWordDataRecordListObject(studentObject,testIndex);
    }

    updateKnownUnknownWordData( studentObject:Student,wordDataArray:Array<PostTestWordData>){
        console.log("update counter:");
        for(let wordDataObj of wordDataArray)
        {
            this.incrementPostAssessmentCounter(studentObject,wordDataObj);
            for(let studentWordObj of studentObject.newKnownUnknownArrayList)
            {
                if(wordDataObj.wordData.wordId == studentWordObj.wordData.wordId)
                {
                    studentWordObj.postAssessmentCounter++;
                }
            }
        }

       

    }

    incrementPostAssessmentCounter(studentObject:Student,wordDataObject:PostTestWordData){
        console.log("Increment counter:");
        var postTestAssessmentDao:PostTestAssessmentDao = new PostTestAssessmentDao();
        postTestAssessmentDao.incrementPostAssessmentCounter(studentObject,wordDataObject);

    }
}