import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { v4 as uuid } from 'uuid';
import { IPost } from '../home';

@IonicPage()
@Component({
  selector: 'page-write-post',
  templateUrl: 'write-post.html',
})
export class WritePostPage implements OnInit {
  
  userId:string ;
  content:string = '';
  currDate:Date; 
  userName:string;
  
  constructor(private _viewCtrl: ViewController,
              public navParams: NavParams,
              private _afDB: AngularFireDatabase,
              public loadingCtlr: LoadingController) {
    }
    
  ngOnInit(){
    this.userId = this.navParams.get('userId');
    this.currDate = new Date();
  }

  async sharePost(){
    const loading = await this.loadingCtlr.create({
      content:"please waiting"
    })
    if(this.content=='')
    {
      alert("You must write something to share a post");
      return;
    }
    try {
      loading.present();
      await this._afDB.database.ref('users').child(this.userId)
      .once('value',(snapshot)=>{
        this.userName = snapshot.val().name;
      })

      let ref = await this._afDB.database.ref('users');
      ref.child(this.userId)
          .child("posts")
          .child(uuid())
          .set(<IPost>{ 
            author:this.userName,
            content:this.content,
            date:this.currDate.toLocaleString()
          })
          this._viewCtrl.dismiss();
              
    } catch (error) {
      console.error(error);
    }
    finally{
      loading.dismiss();
    }
  }

  goBack(){
    this._viewCtrl.dismiss();
  }
}
