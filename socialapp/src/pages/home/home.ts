import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { EAppPages } from '../../../enums';
import { AngularFireDatabase } from '@angular/fire/database';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {

  friendsPostsList :IPost[]=[];
  currentUserId : string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _modalCtrl: ModalController,
              private _afAuth:AngularFireAuth,
              public loadingCtlr: LoadingController,
              private _afDB: AngularFireDatabase,) {
  }

  async ngOnInit() {
    const _loader = await this.loadingCtlr.create({
      content:"please waiting",
      dismissOnPageChange:true
    })
    try {
      _loader.dismiss()
      this.currentUserId = this._afAuth.auth.currentUser.uid ;
      let friendsList = []
      await this._afDB.database.ref('users').child(this.currentUserId).child('friendsList')
      .once('value',(snapshot)=>{
        if(snapshot.val()){
          let list = snapshot.val();
          for(let key in list) {
            const value = list[key];
            friendsList.push(value.id);
          }
        }
      })
      await friendsList.forEach(element=>{
         this._afDB.database.ref('users').child(element).child('posts')
        .once('value',(snapshot)=>{
          if(snapshot.val()){
            let list = snapshot.val();
            for(let key in list){
              const value = list[key];
              this.friendsPostsList.push(value);
            }
          }
        })
      })
      this.friendsPostsList = this.friendsPostsList.sort((a,b)=>(a.date>b.date)?1:-1)
    } catch (error) {
      
    }    
  }

   openWritePostModal(){
    let modal = this._modalCtrl.create('WritePostPage',{'userId':this.currentUserId});
    modal.present();
  }

  async logout(){
    const _loader = await this.loadingCtlr.create({
      content:"please waiting"
    })
    try {
      _loader.present();
      await this._afAuth.auth.signOut();
    } catch (error) {
      console.error(error);
    }
    finally{
      this.navCtrl.setRoot(EAppPages.LoginRegisterPage);
      _loader.dismiss();
    }
  }

  }

  export interface IPost{
    author:string,
    content:string,
    date:string
  }


