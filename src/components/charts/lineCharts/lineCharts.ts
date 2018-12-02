import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Student } from '../../../models/student';
import { MethodSession } from '../../../models/methodIntervetionSession';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { PreSessionResultTest } from '../../../models/PreSessionAssessmentResultTest';
import { MyMap } from '../../../models/myMap';
import { IncrementalRehersalService } from '../../../services/IncrementalRehersalService';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Component({
  selector: 'page-lineCharts',
  templateUrl: 'lineCharts.html'
})

export class LineChart{

    private studentObject:Student=new Student();
    private methodIndex:number=0;
    private methodName:string="";
    private sessionArray:Array<MethodSession>=[];
    private chartLabels = [];
    private data = [];
    private myColors=[];
    private preSessionWordDataArray:Array<PreSessionResultTest>=[];
    private test1Map:MyMap;
    private test2Map:MyMap;
    private incrementalRehrsalService:IncrementalRehersalService= new IncrementalRehersalService();
    p

    private chartData = [];
      chartOptions = {
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Total Items Acquired'
                },
                ticks: {
                    min: 0,

                    stepSize: 1
                }
              }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Sessions'
              },
              ticks: {
                  min: 0,
                  stepSize: 1
              }
            }]
        },
        
      
          // Container for pan options
          pan: {
            // Boolean to enable panning
            enabled: true,
        
            // Panning directions. Remove the appropriate direction to disable 
            // Eg. 'y' would only allow panning in the y direction
            mode: 'xy',
            rangeMin: {
              // Format of min pan range depends on scale type
              x: null,
              y: null
            },
            rangeMax: {
              // Format of max pan range depends on scale type
              x: null,
              y: null
            },
            // Function called once panning is completed
            // Useful for dynamic data loading
          
          },
          
          // Container for zoom options
          zoom: {
            // Boolean to enable zooming
            enabled: true,
        
            // Enable drag-to-zoom behavior
            drag: true,
        
            // Zooming directions. Remove the appropriate direction to disable 
            // Eg. 'y' would only allow zooming in the y direction
            mode: 'xy',
            rangeMin: {
              // Format of min zoom range depends on scale type
              x: null,
              y: null
            },
            rangeMax: {
              // Format of max zoom range depends on scale type
              x: null,
              y: null
            },
            // Function called once zooming is completed
            // Useful for dynamic data loading
          }
        


      };
    
    constructor(private file:File,
      public navCtrl: NavController,
      private storage:Storage) {
  
      storage.get('studentObject').then((val) => {
          var fileData:any = JSON.parse(val);
          this.studentObject = fileData.studentObject;
          this.storage.get('methodIndex').then((val) => {
              var fileData:any = JSON.parse(val);
              this.methodIndex = fileData.methodIndex;
              console.log("methodIndex:"+this.methodIndex);
              this.sessionArray= this.studentObject.methodArray[this.methodIndex].sessionsArray;            
              this.methodName =  this.studentObject.methodArray[this.methodIndex].methodName ;
              var counter:number=0;
              for(let sessionObj of this.sessionArray)
              {
                  this.chartLabels.push(''+(sessionObj.sessionIndex + 1));
                //  this.data.push(sessionObj.sessionIndex+3);
                  // if(sessionObj.sessionIndex >0)
                  // {
                    this.preSessionWordDataArray=[]
                    console.log("retention:"+sessionObj.retentionWordList.values);
                    console.log("control:"+sessionObj.controlItems.values);
                    this.test1Map=sessionObj.retentionWordList;
                    this.test2Map=sessionObj.controlItems;
                    this.updatePreSessionResultTest();
                    for( let preSessionObj of this.preSessionWordDataArray)
                    {
                      if(preSessionObj.isKnownWord)
                        counter++;
                    }
                     console.log("counter:"+counter);
                     this.data.push(counter);
               //     }
                  //console.log(sessionObj.)
              }
              this.chartData.push({ data: this.data, label: 'Intervention Line',lineTension: 0 }); 
              this.myColors.push({
        
                backgroundColor: 'rgba(255,255,255, .1)',
                borderColor: 'blue',
                pointBackgroundColor: 'rgb(103, 58, 183)',
                pointBorderColor: '#fff',
                //pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
              });
                         
              console.log("Method Name:"+this.methodName);
          });
      });
    }
  
    
    //session List
      
    
    onChartClick(event) {
        console.log(event);
    }

    updatePreSessionResultTest(){
      this.preSessionWordDataArray=this.incrementalRehrsalService.compareAssessment(this.test1Map,this.test2Map,this.preSessionWordDataArray);
      
    }

}