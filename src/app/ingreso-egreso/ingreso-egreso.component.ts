import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducers';
import {
  ActivarLoadingAction,
  DesactivarLoadingAction,
} from '../shared/ui.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  forma: FormGroup;
  tipo: string = 'egreso';
  loading: boolean = false;
  subs: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoSvc: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.subs = this.store.select('ui').subscribe((ui)=>{
      this.loading = ui.isLoading;
    })
    this.crearFormulario();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  crearFormulario() {
    this.forma = this.fb.group({
      description: ['', Validators.required],
      monto: [0, Validators.min(0)],
    });
  }

  addIngresoEgreso() {
    this.store.dispatch(new ActivarLoadingAction());

    const ingresoEgreso = new IngresoEgreso({
      ...this.forma.value,
      tipo: this.tipo,
    });

    this.ingresoEgresoSvc
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.forma.reset({
          monto: 0,
        });
        Swal.fire({
          title: 'Agregado correctamente',
          icon: 'success',
          timer: 700,
        });
        this.store.dispatch(new DesactivarLoadingAction());
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          timer: 700,
        });
        this.store.dispatch(new DesactivarLoadingAction());
      });
  }
}
