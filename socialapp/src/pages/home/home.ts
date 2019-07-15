import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { EAppPages } from '../../../enums';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {

  friendsPostsList = [
    {author:'asd',content:' hgvjbkn 4ruihkjhgvjbkn 4ruihkjhgvjbkn 4ruihkj hgvjbkn 4ruihkj hgvjbkn 4ruihkj hgvjbkn 4ruihkj hgvjbkn 4ruihkj hgvjbkn 4ruihkj hgvjbkn 4ruihkj',date:'20/02/2019'},
    {author:'alss',content:'i nje fjkn m42  asddasdas hjkbhkkkkkkkkkkkkk jhbkn gvhbjknm',date:'20/52/2019'},
    {author:'asrdv ',content:'sfdghhhhhhhhhhhhh ',date:'60/02/2019'},
    {author:'asrdv ',content:'sfdghhhhhhhhhhhhh ',date:'60/02/2019'},
  ]

  currentUser : any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _modalCtrl: ModalController,
              private _afAuth:AngularFireAuth,
              public loadingCtlr: LoadingController) {
  }

  async ngOnInit() {
   this.currentUser = this._afAuth.auth.currentUser ;

  }

   openWritePostModal(){
    let modal = this._modalCtrl.create('WritePostPage',{'user':this.currentUser});
    modal.present();
  }

  async logout(){
    const loading = await this.loadingCtlr.create({
      content:"please waiting",
      dismissOnPageChange:true
    })
    try {
      loading.present();
      await this._afAuth.auth.signOut();
    } catch (error) {
      console.error(error);
    }
    finally{
      this.navCtrl.setRoot(EAppPages.LoginRegisterPage);
      loading.dismiss();
    }
  }

  }



