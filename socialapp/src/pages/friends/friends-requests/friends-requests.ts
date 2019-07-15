import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { IUserRequest } from '../friends';


@IonicPage()
@Component({
  selector: 'page-friends-requests',
  templateUrl: 'friends-requests.html',
})
export class FriendsRequestsPage implements OnInit {

  currUserId:string;
  friendsRequestList :IUserRequest[]=[]

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _viewCtrl:ViewController,
              private _afDB: AngularFireDatabase,
              public loadingCtlr: LoadingController) {
  }
  
  async ngOnInit(){
      let _loader = this.loadingCtlr.create({
        content:"please waiting"
      })
    try {
      _loader.present();
      this.currUserId = this.navParams.get('userId');
      await this._afDB.database.ref('users')
                   .child(this.currUserId)
                   .child('friendsRequestList')
                   .once('value',(snapshot)=>{
                    let requests = snapshot.val();
                    if(requests){
                      for(let key in requests){
                        const value = requests[key];
                        this.friendsRequestList.push(<IUserRequest>{
                          email:value.email,
                          id:value.id,
                          name:value.name
                        })    
                      }
                    }                  
                   }) 
    } catch (err) {
      console.error(err);
    }
    finally{
      _loader.dismiss();
    }
  }

  async acceptRequest(user){
    let _loader = this.loadingCtlr.create({
      content:"please waiting"
    })
    try {
      _loader.present();
      let currUser;
      await this._afDB.database.ref('users')
      .child(this.currUserId)
      .once('value',(snapshot)=>{
        currUser = snapshot.val();
      })

      await this._afDB.database.ref('users')
      .child(this.currUserId)
      .child('friendsList')
      .child(user.id)
      .set(user);
      
      await this._afDB.database.ref('users')
      .child(user.id)
      .child('friendsList')
      .child(this.currUserId)
      .set(<IUserRequest>{
        id:this.currUserId,
        email:currUser.email,
        name:currUser.name
      })

      await this._afDB.database.ref('users')
      .child(this.currUserId)
      .child('friendsRequestList')
      .child(user.id)
      .remove()           
                                
      let idx = this.friendsRequestList.findIndex(i=>i.id == user.id);
      this.friendsRequestList.splice(idx,1);  
    
    } catch (err) {
      console.error(err);
    }
    finally{
      _loader.dismiss();
    }
  }
  
  async rejectRequest(user){
    let _loader = this.loadingCtlr.create({
      content:"please waiting"
    })
    try {
      _loader.present();
      await this._afDB.database.ref('users')
      .child(this.currUserId)
      .child('friendsRequestList')
      .child(user.id)
      .remove()

      let idx = this.friendsRequestList.findIndex(i=>i.id == user.id);
      this.friendsRequestList.splice(idx,1);                          
    } catch (err) {
      console.error(err);
    }
    finally{
      _loader.dismiss();
    }
  }

  goBack(){
    this._viewCtrl.dismiss();
  }

}
