import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { v4 as uuid } from 'uuid';
import Long from 'long';

@IonicPage()
@Component({
  selector: 'page-write-post',
  templateUrl: 'write-post.html',
})
export class WritePostPage implements OnInit {
  
  user:any ;
  content:string = '';
  currDate:Date; 

  
  constructor(private _viewCtrl: ViewController,
              public navParams: NavParams,
              private _afDB: AngularFireDatabase,
              public loadingCtlr: LoadingController) {
    }
    
  ngOnInit(){
    this.user = this.navParams.get('user');
    this.currDate = new Date();
  }

  async sharePost(){
    
    const loading = await this.loadingCtlr.create({
      content:"please waiting",
      dismissOnPageChange:true
    })
    try {
      loading.present();
      let ref = await this._afDB.database.ref('users');
      ref.child(this.user.uid)
          .child("posts")
          .child(uuid())
          .set({
            content:this.content,
            dateCreated:this.currDate.toString()
          })
          this._viewCtrl.dismiss();
              
    } catch (error) {
      console.error(error);
    }
    finally{
      loading.dismiss();
    }

  }

}
