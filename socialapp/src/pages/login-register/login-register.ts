import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EAppPages } from '../../../enums';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase/app';
// import firebase from 'firebase'; require('firebase/auth')
import { AngularFireAuth } from '@angular/fire/auth';



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
              private AFauth:AngularFireAuth,
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

  asd(){
    
  }

  async onSubmit( frm:NgForm ){
    // console.log(frm);
    let form = frm;
    // let res = await this.AFauth.auth.createUserWithEmailAndPassword(form.value.mail, form.value.password)
      // return firebase.auth().createUserWithEmailAndPassword(form.value.mail, form.value.password).
      //         then(()=> console.log("Asd")).
      //         catch(err=>{console.log(err);       throw new Error(err);

      //         })
  }

  
}

enum  ERegisterLogin{
  Register,
  Login
}