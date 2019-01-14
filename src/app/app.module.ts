import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../components/home/home';
import { ListPage } from '../pages/list/list';
import { Login } from '../components/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { AddStudent } from '../components/AddStudent/AddStudent';
import { ViewStudent } from '../components/viewStudent/viewStudent';
import { DataProvider } from '../providers/data/data';
import { StudentdashBoard } from '../components/studentDashBoard/studentDashBoard';
import { GlobalVariables } from '../models/globalVariables';
import { AddWordList } from '../components/addWordList/addWordList';
import { ViewWordList } from '../components/viewWordList/viewWordList';
import { FlashCard } from '../components/flashCardTest/flashCard';
import { PreSessionView } from '../components/methodSessions/viewPreSessionData/preSessionData';
import { FlashCardIntervetion } from '../components/methodSessions/flashCardTest/flashCardIntervention';
import { AssessmentTest } from '../components/Assessment/BeginAssessmentTest/assessmentTest';
import { ViewAssessmentTest } from '../components/Assessment/viewAssessment/viewAssessment';
import { PreSessionFlashCard } from '../components/methodSessions/flashCardTest/preSessionFlashCardTest/preSessionFlashCard';
import { SessionSummary } from '../components/methodSessions/flashCardTest/sessionSummary/sessionSummary';
import { PreSessionResult } from '../components/methodSessions/flashCardTest/preeSessionResult/preSessionResult';
import { PreSessionResultTest } from '../models/PreSessionAssessmentResultTest';
import { IonicStorageModule } from '@ionic/storage';
import { SessionList } from '../components/methodSessions/sessionsList/sessionList';
import { DIFlashCardSessionTest } from '../components/methodSessions/flashCardTest/DIMethodSessionTest/DIFlashCardSessionTest';
import { ChartsModule } from 'ng2-charts';
import { LineChart } from '../components/charts/lineCharts/lineCharts';
import { PreSessionAssessmentView } from '../components/methodSessions/preSessionAssessment/preSessionAssessmentView/preSessionAssessmentView';
import { ViewDataSetList } from '../components/datasetList/viewDataSetList/viewDataSetList';
import { ViewStudentAllWords } from '../components/studentDashBoard/ViewStudentAllWords/viewStudentAllWords';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DocumentPicker } from '@ionic-native/document-picker';
import { ViewPreSessionUnKnownWord } from '../components/methodSessions/flashCardTest/preeSessionResult/viewPreSessionUnknownWord/viewPreSessionUnKnownWord';
import { Firebase } from '@ionic-native/firebase';
import { FirebaseProvider } from '../providers/firebase/firebase';


import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import * as firebase from 'firebase';
import { PostAssessmentDashBoard } from '../components/PostAssessment/postAssessmentDashBoard/postAssessmentDashBoard';
import { StartNewPostAssessment } from '../components/PostAssessment/startNewPostAssessment/startNewPostAssessment';
import { ViewPostAssessmentList } from '../components/PostAssessment/viewPostAssessmentList/viewPostAssessmentList';
import { ViewPostAssessmentRecordList } from '../components/PostAssessment/viewPostAssessment/viewPostAssessmentRecordList';
import { PostAssessmentFlashCard } from '../components/PostAssessment/postAssessmentFlashCard/postAssessmentFlashCard';
import { ViewSubPostTestAssessmentRecord } from '../components/PostAssessment/viewSubPostTestAssessmentRecord/viewSubPostTestAssessmentRecord';
import { AddEmailList } from '../components/login/addEmail/addEmailList';
import { AddUserDetails } from '../components/login/addUserDetails/addUserDetails';
import { SecurityCheckUp } from '../components/login/forgetPassword/securityCheckUP/securityCheckUP';
import { Signout } from '../components/login/signout/Signout';


const firebaseConfig = {
  apiKey: "AIzaSyDnFDx9WT_WnS0q4avo6BsoKUl9Cc5jJx0",
  authDomain: "acdemic-flashcard-intervention.firebaseapp.com",
  databaseURL: "https://acdemic-flashcard-intervention.firebaseio.com",
  projectId: "acdemic-flashcard-intervention",
  storageBucket: "acdemic-flashcard-intervention.appspot.com",
  messagingSenderId: "490691003601"
  };
 
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Login,
    AddStudent,
    ViewStudent,
    StudentdashBoard,
    AddWordList,
    ViewWordList,
    AssessmentTest,
    PreSessionView,
    FlashCard,
    ListPage,
    FlashCardIntervetion,
    PreSessionFlashCard,
    ViewAssessmentTest,
    SessionSummary,
    PreSessionResult,
    SessionList,
    DIFlashCardSessionTest,
    LineChart,
    PreSessionAssessmentView,
    ViewDataSetList,
    ViewStudentAllWords,
    ViewPreSessionUnKnownWord,
    PostAssessmentDashBoard,
    StartNewPostAssessment,
    ViewPostAssessmentRecordList,
    ViewPostAssessmentList,
    PostAssessmentFlashCard,
    ViewSubPostTestAssessmentRecord,
    AddEmailList,
    AddUserDetails,
    SecurityCheckUp,
    Signout
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Login,
    AddStudent,
    ViewStudent,
    StudentdashBoard,
    AddWordList,
    ViewWordList,
    FlashCard,
    ListPage,
    PreSessionView,
    AssessmentTest,
    FlashCardIntervetion,
    PreSessionFlashCard,
    ViewAssessmentTest,
    SessionSummary,
    PreSessionResult,
    SessionList,
    DIFlashCardSessionTest,
    LineChart,
    PreSessionAssessmentView,
    ViewDataSetList,
    ViewStudentAllWords,
    ViewPreSessionUnKnownWord,
    PostAssessmentDashBoard,
    StartNewPostAssessment,
    ViewPostAssessmentRecordList,
    ViewPostAssessmentList,
    PostAssessmentFlashCard,
    ViewSubPostTestAssessmentRecord,
    AddEmailList,
    AddUserDetails,
    SecurityCheckUp,
    Signout
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    GlobalVariables,
    ScreenOrientation,
    SocialSharing,
    DocumentPicker,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    FirebaseProvider
  ]
})
export class AppModule {}
