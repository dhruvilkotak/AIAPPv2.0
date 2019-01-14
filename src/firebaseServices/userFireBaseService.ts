import { UserFireBaseDao } from "../dao/userFireBaseDao";
import { User } from "../models/user";
import { NavController } from "ionic-angular";

export class UserFireBaseService{

    private userBaseDao:UserFireBaseDao;
    constructor(){
        this.userBaseDao=new UserFireBaseDao();
    }

    removeEmailId(emailId:string){
    
        this.userBaseDao.removeEmailId(emailId);
    }

    updateUserDetails(userDetails:User)
    {
        this.userBaseDao.updateUserDetails(userDetails);
    }

    removeEmailIdFromArray(emailIdList : Array<string>,emailId:string){

        var remove:boolean=false;
      
        for(let obj of emailIdList )
        {
            if(obj == emailId)
            {
                const index: number = emailIdList.indexOf(obj);
                if (index !== -1) {
                    console.log("index:"+index);
                    emailIdList.splice(index, 1);
                    remove=true;
                    return remove;
                } 
            }
        }
        return remove;

    }


    addNewEmail(emailId:string):Promise<any>
    {
        return new Promise(function(resolve,reject){
            var userFireBaseDao:UserFireBaseDao = new UserFireBaseDao();
            userFireBaseDao.addNewEmail(emailId).then(data=>{
                resolve(data);
            }).catch(err=>{
                reject(err);
            });
        });

    }

    getEmailIdList():Promise<any>
    {
        return new Promise(function(resolve, reject) {

            var userFireBaseDao:UserFireBaseDao = new UserFireBaseDao();
            var emailIdList:Array<string>=[];
            userFireBaseDao.getEmailIdList().then(data=>{
                emailIdList=data;
                resolve(emailIdList);
                
            }).catch(err=>{
                console.log("erer:"+err);
                resolve(emailIdList);
            });              
        });
    }

    registerUserDetails(userDetails:User,navCtrl:NavController):Promise<any>
    {
        return new Promise(function(resolve, reject) {
            var userBaseDao:UserFireBaseDao = new UserFireBaseDao();
            userBaseDao.registerUserDetails(userDetails,navCtrl).then(data=>{
                resolve(data);
            }).catch(err=>{
                reject(err);
            });
        });
    }

    loginUser(emailID,password):Promise<any>
    {
        return new Promise(function(resolve, reject) {
            var userBaseDao:UserFireBaseDao = new UserFireBaseDao();
            userBaseDao.loginUser(emailID,password).then(data=>{
                resolve(data);
            }).catch(err=>{
                reject(err);
            });
        });
    }
}