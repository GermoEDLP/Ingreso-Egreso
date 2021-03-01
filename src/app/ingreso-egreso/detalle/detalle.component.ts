import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from 'src/app/shared/ui.actions';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { IngresoEgresoService } from '../ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit {
  items: IngresoEgreso[];

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoSvc: IngresoEgresoService
  ) {}

  ngOnInit() {
    this.iniciar();
  }

  iniciar() {
    this.store.dispatch(new ActivarLoadingAction());
    this.store.select('ingresoEgreso').subscribe((data: any) => {
      this.items = data.items;
      this.store.dispatch(new DesactivarLoadingAction());
    });
  }

  borrarItem(uid: string) {
    this.ingresoEgresoSvc
      .borrarIngresoEgreso(uid)
      .then()
      .catch((e) => {
        console.log(e);
      });
  }
}
