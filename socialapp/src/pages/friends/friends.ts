import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';


@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage implements OnInit , OnDestroy {
  
  _searchText: string = '';
  allFriendsList : IUser[] = [];
  displayedfriendsList : IUser[] = [];
  myfriendsList : string[] = [];
   currUser:IUserRequest = {
    email:'',
    id:'',
    name:''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _afDB: AngularFireDatabase,
              private _afAuth:AngularFireAuth,
              public loadingCtlr: LoadingController,
              private _modalCtrl:ModalController) {
 
    }

  async ngOnInit(){
    let _loader = this.loadingCtlr.create({
      content:"please waiting",
    })
    try {
      _loader.present();
      const currUserEmail:string = this._afAuth.auth.currentUser.uid;
      await this._afDB.database.ref('users').once('value',(snapshot) =>{
        let users = snapshot.val();
        for(let key in users) {
              const value = users[key];
              if(key!=currUserEmail){
                this.allFriendsList.push( <IUser>{
                  id :key,
                  email:value.email,
                  name:value.name,
                  posts:value.posts
                })                     
              }else{
                this.currUser = {
                  email:value.email,
                  name:value.name,
                  id:key
                } 
              }
            
        }
      })
      await this._afDB.database.ref('users').child(this.currUser.id).child('friendsList')
       .once('value',(snapshot)=>{
          let friends = snapshot.val();
          for (const key in friends) {
             this.myfriendsList.push(key)
          }
      })
      
      this.allFriendsList.forEach(item=>{
        let idx = this.myfriendsList.findIndex(i=>item.id==i);
        if(idx == -1){
          item.Notfriends = true;
        }
      })

      this.displayedfriendsList = this.allFriendsList;
    } catch (error) {
      console.error(error);
    }
    finally{
      if(_loader)
        _loader.dismiss();
    }
  
  }

  onSearchPage(event){
    this._searchText = event.target['value'];
    if(this._searchText){
      this.displayedfriendsList = this.allFriendsList.filter(item => item.name.includes(this._searchText.trim().toLowerCase()))
    }
    else{
      this.displayedfriendsList = this.allFriendsList;
    }
  }

  isUserAlreadyFriend(user){
    return this.myfriendsList.findIndex(i=>i=user.id)==-1 ? false:true;
  }

  async sendFriendRequest(userToSent){
    let _loader = this.loadingCtlr.create({
      content:"please waiting"
    })
    try {
      _loader.present();
      await this._afDB.database.ref('users')
                        .child(userToSent.id)
                        .child("friendsRequestList")
                        .child(this.currUser.id)
                        .set(this.currUser)
      userToSent.text = "Friend Request Sent"
    } catch (err) {
      console.error(err);
    }
    finally{
      if(_loader)
        _loader.dismiss();
    }
  }

  openFriendsRequestsList(){
    let modal = this._modalCtrl.create('FriendsRequestsPage',{'userId':this.currUser.id});
    modal.present();
  }

  ngOnDestroy(){
    this.allFriendsList = [];
    this.displayedfriendsList = [];
    this.myfriendsList = [];
  }

}

export interface IUser{
  id:string,
  email: string,
  name: string,
  posts?: any[],
  Notfriends?:boolean,
  text?:string
}

export interface  IUserRequest{
  id:string,
  name: string,
  email: string
}