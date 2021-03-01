import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from '../app.reducers';
import { AuthService } from '../auth/auth.service';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {

  listenerSub: Subscription = new Subscription();
  itemsSub: Subscription = new Subscription();

  constructor(
    private afDB: AngularFirestore,
    private authSvc: AuthService,
    private store: Store<AppState>
  ) {}

  initIngresoEgresoListener() {
    this.listenerSub = this.store
      .select('auth')
      .pipe(
        // El filter solo deja llegar al suscribe aqullos valores distintos de null
        // es decir, el observable solo ve cuando hay un user autenticado
        filter((auth) => auth.user != null)
      )
      .subscribe((auth) => {
        this.ingresoEgresoItems(auth.user.uid);
      });
  }

  private ingresoEgresoItems(uid: string) {
    this.itemsSub = this.afDB
      .collection(`${uid}/ingreso-egreso/items`)
      // a diferencia del valueChanges, el snapShotChanges nos trae mas info de metadata y ademas el uid
      .snapshotChanges()
      .pipe(
        // NO CONFUNDIR: Este map es el de rxjs y nos permite devolver al observable informacion seteada por nosotros en base a la que viene
        map((docData) => {
          // Este map es el de JS y nos permite trabajar sobre cada elemento como un foreach devolviendo lo que querramos
          return docData.map((doc: any) => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data(),
            };
          });
        })
      )
      .subscribe((collection: IngresoEgreso[]) => {
        this.store.dispatch(new SetItemsAction(collection));
      });
  }

  cancelarSubs(){
    this.listenerSub.unsubscribe();
    this.itemsSub.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authSvc.getUsuario();

    return this.afDB
      .doc(`${user.uid}/ingreso-egreso`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  borrarIngresoEgreso(uid: string) {
    const user = this.authSvc.getUsuario();

    return this.afDB.doc(`${user.uid}/ingreso-egreso/items/${uid}`).delete();
  }
}
