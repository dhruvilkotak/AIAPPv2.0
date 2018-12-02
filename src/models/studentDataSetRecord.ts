import { Dataset } from "./Dataset";

export class StudentDataSetRecord{
    datasetObject:Dataset;
    completedStatus:boolean=false; //   dataset is completed
    selectedDataset:boolean = false;// dataset selected for previous test or not

}