import { Component } from "@angular/core";
import { NavController, NavParams, Checkbox } from "ionic-angular";
import { Student } from "../../../models/student";
import { KnownUnknownWordData } from "../../../models/knownUnknownWordData";
import { FormGroup, FormBuilder, FormControl, FormArray, ValidatorFn } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { ViewPostAssessmentList } from "../viewPostAssessmentList/viewPostAssessmentList";


@Component({
    selector: 'page-startNewPostAssessment',
    templateUrl: 'startNewPostAssessment.html'
  })
export class StartNewPostAssessment{

    studentObject:Student=new Student();
    error:string="";
    newLearnedWords:Array<KnownUnknownWordData> = [];
    allData_newLearnedWords:Array<KnownUnknownWordData> = [];
    private searchTerm: string = '';
    selectAll:boolean=true;

    controls = this.allData_newLearnedWords.map(c => new FormControl(false));
               
    myGroup: FormGroup=this.formBuilder.group({
        wordObjectsList: new FormArray(this.controls, this.minSelectedCheckboxes(0))
      });;
 
    
    constructor(public navCtrl: NavController,
        private navParams:NavParams,  
        private storage:Storage,
        private formBuilder: FormBuilder) {
            
            this.controls = this.allData_newLearnedWords.map(c => new FormControl(false));
         //   controls[0].setValue(true); // Set the first checkbox to true (checked)
        
            this.myGroup = this.formBuilder.group({
              wordObjectsList: new FormArray(this.controls)
            });


            console.log("start new post assessment");
            this.storage.get('studentObject').then((val) => {
                var fileData:any = JSON.parse(val);
                this.studentObject = fileData.studentObject;
         
                if(this.studentObject.newKnownUnknownArrayList==null)
                    this.studentObject.newKnownUnknownArrayList=[];
             
                this.newLearnedWords=this.studentObject.newKnownUnknownArrayList;
                this.allData_newLearnedWords=this.studentObject.newKnownUnknownArrayList;

                this.error="";
                console.log("len:"+this.allData_newLearnedWords.length+"  start new post assessment:"+ JSON.stringify({x:this.allData_newLearnedWords[0].wordData}));
                
                this.controls = this.allData_newLearnedWords.map(c => new FormControl(true));
                  this.myGroup = this.formBuilder.group({
                    wordObjectsList: new FormArray(this.controls, this.minSelectedCheckboxes(1))
                });
              });
         
    }

    public ionViewWillEnter() {
      this.storage.get('studentObject').then((val) => {
        var fileData:any = JSON.parse(val);
        this.studentObject = fileData.studentObject;
 
        if(this.studentObject.newKnownUnknownArrayList==null)
            this.studentObject.newKnownUnknownArrayList=[];
     
        this.newLearnedWords=this.studentObject.newKnownUnknownArrayList;
        this.allData_newLearnedWords=this.studentObject.newKnownUnknownArrayList;
        this.filterItems();
        this.error="";
        console.log("len:"+this.allData_newLearnedWords.length+"  start new post assessment:"+ JSON.stringify({x:this.allData_newLearnedWords[0].wordData}));
        
        this.controls = this.allData_newLearnedWords.map(c => new FormControl(true));
          this.myGroup = this.formBuilder.group({
            wordObjectsList: new FormArray(this.controls, this.minSelectedCheckboxes(1))
        });
      });
      
    }  
    filterItems(){
 
        this.newLearnedWords = this.allData_newLearnedWords.filter((newKnownUnknownObject) => {
            return newKnownUnknownObject.wordData.wordText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
            newKnownUnknownObject.wordData.wordCategory.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          });
    }

    startNewPostAssessmentTest(){

      
      var selectedWordDataList:Array<KnownUnknownWordData> = this.myGroup.value.wordObjectsList
      .map((v, i) => v ? this.allData_newLearnedWords[i] : null)
      .filter(v => v !== null);

      if(selectedWordDataList ==null || selectedWordDataList.length<=0)
      {
          this.error="select one word at least.";
      }
      else{
          this.error="";
          if(this.studentObject.postTestWordDataRecordListArray == null )
            this.studentObject.postTestWordDataRecordListArray=[];
          this.storage.set('KnownUnknownWordDataList',JSON.stringify({ KnownUnknownWordDataList: selectedWordDataList }) );
          this.storage.set('testIndex',JSON.stringify({ testIndex: this.studentObject.postTestWordDataRecordListArray.length }) );   
          this.navCtrl.push(ViewPostAssessmentList);
        //start flash card set storage data
      }

    }

    minSelectedCheckboxes(min = 1)
    {
        const validator: ValidatorFn = (formArray: FormArray) => {
          const totalSelected = formArray.controls
            // get a list of checkbox values (boolean)
            .map(control => control.value)
            // total up the number of checked checkboxes
            .reduce((prev, next) => next ? prev + next : prev, 0);
      
          // if the total is not greater than the minimum, return the error message
          return totalSelected >= min ? null : { required: true };
        };
      
        return validator;
      }
      
      updateSelectAll(){
        this.controls = this.allData_newLearnedWords.map(c => new FormControl(this.selectAll));
        this.myGroup = this.formBuilder.group({
          wordObjectsList: new FormArray(this.controls, this.minSelectedCheckboxes(1))
      });
        console.log("checked all :"+this.selectAll);
      }

  
}