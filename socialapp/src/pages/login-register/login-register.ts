import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EAppPages } from '../../../enums';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { IUser } from '../friends/friends';



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
                let user = <IUser>{
                  name : form.value.username,
                  email : data.user.email,
                  id:data.user.uid
                } 
                let ref = this._afDB.database.ref('users');
                ref.child(data.user.uid).set(user)
                this.navCtrl.push(EAppPages.TabsPage);
              })
              .catch(err => {
                console.error(err)
                alert(err.message)
              })
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