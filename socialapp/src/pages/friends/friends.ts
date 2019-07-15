import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AngularFireDatabase, snapshotChanges } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';


@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage implements OnInit {
  
  _searchText: string = '';
  allFriendsList : IUser[] = [];
  displayedfriendsList : IUser[] = [];
  _btnText:string = '';
  _loader:Loading;
  currUser:IUserRequest = {
    email:'',
    id:'',
    name:''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _afDB: AngularFireDatabase,
              private _afAuth:AngularFireAuth,
              public loadingCtlr: LoadingController) {
 
  }

  async ngOnInit(){
    try {
       this._loader = await this.loadingCtlr.create({
        content:"please waiting",
        dismissOnPageChange:true
      })
      this._loader.present();
      const currUserEmail:string = this._afAuth.auth.currentUser.uid;
      await this._afDB.database.ref('users').once('value',(snapshot) =>{
        let users = snapshot.val();
        for(let key in users) {
              const value = users[key];
              if(key!=currUserEmail){
                this.allFriendsList.push( <IUser>{
                  id :key,
                  email:value.email,
                  friendsNumber:value.friendsNumber,
                  name:value.name,
                  posts:value.posts,
                  postsNumber:value.postsNumber
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
      this.displayedfriendsList = this.allFriendsList;
      this._btnText = "Send Friend Request"
    } catch (error) {
      console.error(error);
    }
    finally{
      this._loader.dismiss();
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

  async sendFriendRequest(userToSent){
    try {
      this._loader.present();
      await this._afDB.database.ref('users')
                        .child(userToSent.id)
                        .child("friendsRequestList")
                        .child(this.currUser.id)
                        .set(this.currUser)
      this._btnText = "Friend Request Sent"
    } catch (err) {
      console.error(err);
    }
    finally{
      this._loader.dismiss();
    }
  }

}

interface IUser{
  id:string,
  email: string,
  friendsNumber: number,
  name: string
  posts: any[],
  postsNumber: number
}

interface IUserRequest{
  id:string,
  name: string,
  email: string
}