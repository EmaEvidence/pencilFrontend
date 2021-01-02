import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any;

  constructor(
    public afs: AngularFirestore,
    public auth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
  ) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.ngZone.run(() => {
          this.router.navigate(['editor']);
        });
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        this.ngZone.run(() => {
          this.router.navigate(['']);
        })
      }
    })
  }


  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  GoogleAuth() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result) => {
      console.log(result, '=-=-=-result=--=-=-')
       this.ngZone.run(() => {
          this.router.navigate(['editor']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      console.log(error, '=-=-=-error=--=-=-')
      window.alert(error)
    })
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  SignOut() {
    console.log('--=-=-clicker==-=-=-')
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['editor']);
    })
  }

}