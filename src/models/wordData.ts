import {Component } from "@angular/core"
import { File } from "@ionic-native/File";
import { UUID } from "angular2-uuid";

export class WordData{
    
    wordId:String;
    wordText:String;
    wordCategory:String;
    totalAskedTime:number=0;
    correctedTime:number=0;
    constructor()
    {
        this.wordId=UUID.UUID();
        console.log("uuid:"+UUID);
    }

}