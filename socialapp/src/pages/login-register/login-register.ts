import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EAppPages } from '../../../enums';
import { NgForm } from '@angular/forms';
import { HomePage }  from './../home/home';
// import firebase from 'firebase'; require('firebase/auth')
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';



@IonicPage()
@Component({
  selector: 'page-login-register',
  templateUrl: 'login-register.html',
})
export class LoginRegisterPage implements OnInit{

  segmentSelect : ERegisterLogin; 
  Register = ERegisterLogin.Register;
  Login = ERegisterLogin.Login;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _afAuth:AngularFireAuth,
              private _afDB: AngularFireDatabase
              ) {

  }

  ngOnInit() {
    this.segmentSelect = ERegisterLogin.Register;
  }

  segmentChanged(event){
    const selectedValue = event._value;
    if(selectedValue == "register")
    {
      this.segmentSelect = ERegisterLogin.Register;
    }
    else{
      this.segmentSelect = ERegisterLogin.Login;
    }
  }


  async onSubmit( frm:NgForm ){
    // console.log(frm);
    let form = frm;
    if(form.valid){
      if(this.segmentSelect == ERegisterLogin.Login)
      {
        await this._afAuth.auth.signInWithEmailAndPassword(form.value.mail, form.value.password)
              .then((user)=>{
                this.navCtrl.setRoot(EAppPages.TabsPage)
              })
              .catch(err => console.error(err))
      }
      else
      {
        await this._afAuth.auth.createUserWithEmailAndPassword(form.value.mail, form.value.password)
              .then((data)=>{
                let user = {
                  name : form.value.username,
                  email : data.user.email,
                  friendsNumber:0,
                  friendsList:[],
                  postsNumber:0,
                  posts:[]
                } 
                let ref = this._afDB.database.ref('users');
                ref.child(data.user.uid).set(user)
                this.navCtrl.push(EAppPages.TabsPage);
              })
              .catch(err => console.error(err))
      }
    }
    else{
      alert("please insert a valid values.")
    }
  }

  
}

enum  ERegisterLogin{
  Register,
  Login
}