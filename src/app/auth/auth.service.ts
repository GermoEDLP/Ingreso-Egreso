import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { AppState } from '../app.reducers';
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private store: Store<AppState>,
    private afDB: AngularFirestore
  ) {}

  userSub: Subscription = new Subscription();

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser) => {

      if(fbUser){
        this.userSub = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges().subscribe((user: any)=>{

          const newUser = new User(user);
          this.store.dispatch(new SetUserAction(newUser));

        })
      }else{
        this.userSub.unsubscribe();
      }

    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        // console.log(resp);
        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email,
        };

        this.afDB
          .doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.store.dispatch(new DesactivarLoadingAction());

            // this.router.navigate(['/']);
          });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error en el login', error.message, 'error');
        this.store.dispatch(new DesactivarLoadingAction());
      });
  }

  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        // console.log(resp);
        this.store.dispatch(new DesactivarLoadingAction());

        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error en el login', error.message, 'error');
      });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map((fbUser) => {
        if (fbUser == null) {
          this.router.navigate(['/login']);
        }

        return fbUser != null;
      })
    );
  }
}
