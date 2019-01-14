
import * as firebase from 'firebase';
import { User } from '../models/user';
import { NavController } from 'ionic-angular';
import { Login } from '../components/login/login';

export class UserFireBaseDao{
    
    removeEmailId(emailId:string){
        const  databaseRef = firebase.database().ref('EmailIdList/');
        databaseRef.orderByChild('emailId').equalTo(""+emailId)
        .once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
            //remove each child
                databaseRef.child(childSnapshot.key).remove();
            });
        });
        return;
    }

    addNewEmail(emailId:string):Promise<any>
    {
        return new Promise(function(resolve,reject){
            let databaseRef = firebase.database().ref('EmailIdList/');
            var query=databaseRef.orderByChild('emailId').equalTo(emailId);
            query.on('value',function(snapshot){
                console.log("childern:",snapshot.toJSON);
                if(snapshot.hasChildren())
                {
                }
                else{
                    let databaseRef = firebase.database().ref('EmailIdList/');
                    let newInfo = databaseRef.push();
                    var newItem = {
                        emailId: emailId
                    };
                    newInfo.set(newItem);
                    
                    resolve(emailId);
                    
                }
                query.off();
                
                return;
            });
        });

    }

    getEmailIdList():Promise<any>
    {
       
        return new Promise(function(resolve, reject) {
              
            var emailIdList:Array<string>=[];
            let databaseRef = firebase.database().ref('EmailIdList/');
            databaseRef.on('value',function(snapshot){
                if(snapshot.hasChildren())
                {
                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key;
                        var emailObject:string = childSnapshot.val().emailId;
                        console.log(" student text:"+childSnapshot.key + " val:"+childSnapshot.val+"  email:"+emailObject);
                        emailIdList.push(emailObject);
                   });
                   resolve(emailIdList);
                   databaseRef.off();
                }
                else{
                 resolve(emailIdList);
                    databaseRef.off();
                }    
                databaseRef.off();
                return;
            });
        });
    }

    registerUserDetails(userDetails:User,navCtrl:NavController):Promise<any>
    {
        return new Promise(function(resolve, reject) {

            console.log("Register user details");

            firebase.auth().createUserWithEmailAndPassword(userDetails.emailId,userDetails.password).then(data=>{
                console.log("created user with email pwd");
       
                userDetails.userUID= data.user.uid;
                var userFireBaseDao:UserFireBaseDao = new UserFireBaseDao();   
                userFireBaseDao.addUserToFirebase(userDetails).then(data=>{
                      console.log("add user to firebase");
                      var userFireBaseDao:UserFireBaseDao = new UserFireBaseDao();   
                      userFireBaseDao.sendVerficationCode().then(data=>{
                        
                        resolve(data);
                         
                        }).catch(err=>{
                            reject(err);
                          }) ;
                          
                    }).catch(err=>{
                        reject(err);
                  }) ;
        
               
              })
              .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("err0r:"+error.message);
                reject(error.message);
                // ...
              });
                
        });
    }

    addUserToFirebase(userDetails:User):Promise<any>{
        return new Promise(function(resolve, reject) {
        
            console.log("add user to firebase 2");
            let databaseRef = firebase.database().ref('userDetailsList/');
            var query=databaseRef.orderByChild('emailId').equalTo(userDetails.emailId);
            query.on('value',function(snapshot){
                console.log("childern:",snapshot.toJSON);
                if(snapshot.hasChildren())
                {
                }
                else{
                    console.log("added user to firebase");
                    let databaseRef = firebase.database().ref('userDetailsList/'+userDetails.userUID+'/');
                    databaseRef.set(userDetails)
                    //let newInfo = databaseRef.push();
                    //userDetails.userUID=newInfo.key;
                    //newInfo.set(userDetails);
                    
                    resolve(userDetails);
                    
                }
                query.off();
                
                return;
            });

        });
    }

    sendVerficationCode():Promise<any>
    {

        return new Promise(function(resolve, reject) {
      
            var user = firebase.auth().currentUser;
            console.log("send verification");
                        
            user.sendEmailVerification().then(function(){
                resolve("done.");
                console.log("sent verification");
            }).catch(function(error){
        
            });
        });
    }


    updateUserDetails(userDetails:User)
    {
        let databaseRef = firebase.database().ref('userDetailsList/'+userDetails.userUID+'/');
        databaseRef.update(userDetails);
    }

    
    loginUser(emailID,password):Promise<any>
    {
        return new Promise(function(resolve, reject) {
          try{
            const  databaseRef = firebase.database().ref('userDetailsList/');
            databaseRef.orderByChild('emailId').equalTo(""+emailID)
            databaseRef.orderByChild('password').equalTo(""+password)
            .once('value').then(function(snapshot) {

              if(snapshot.hasChildren())
              {
                snapshot.forEach(function(childSnapshot) {
                    //remove each child
                    
                    var userDetails:User = childSnapshot.val();
                     resolve(userDetails);
                    });
              }
              else{
                  reject("Email Id or paswword is not matching.");
              }
                
            });

          }
            catch(e)
            {
                reject(e);
            }            
        });
    }
}