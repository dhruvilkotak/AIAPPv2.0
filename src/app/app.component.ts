import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../components/home/home';
import { ListPage } from '../pages/list/list';
import { Login } from '../components/login/login'
import { AddStudent } from '../components/AddStudent/AddStudent';
import { ViewStudent } from '../components/viewStudent/viewStudent';
import { StudentdashBoard } from '../components/studentDashBoard/studentDashBoard';
import { ViewWordList } from '../components/viewWordList/viewWordList';
import { AddWordList } from '../components/addWordList/addWordList';
import { FlashCard } from '../components/flashCardTest/flashCard';
import { LineChart } from '../components/charts/lineCharts/lineCharts';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { WordDataFireBaseService } from '../firebaseServices/WordDataFireBaseService';
import { File } from '@ionic-native/file';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private screenOrientation: ScreenOrientation,
    private file:File) {

    this.initializeApp();
         

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Add Word List', component: AddWordList },
      { title: 'View Word List', component: ViewWordList }
      ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log("screen orientation:landscape");
      var wordDataFireBaseService:WordDataFireBaseService = new WordDataFireBaseService();
      wordDataFireBaseService.writeFireBaseWordToFile(this.file).then(data=>{
          
        }).catch(err=>{
          
        });
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
           
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
