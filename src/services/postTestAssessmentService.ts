import { Student } from "../models/student";
import { KnownUnknownWordData } from "../models/knownUnknownWordData";
import { PostTestWordData } from "../models/PostTestWordData";
import { PostTestWordDataRecordList } from "../models/postTestWordDataRecordList";
import { PostTestAssessmentDao } from "../dao/PostTestAssessmentDao";

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

}