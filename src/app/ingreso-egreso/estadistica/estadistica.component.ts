import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Label, MultiDataSet, SingleDataSet } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit {
  subscription: Subscription = new Subscription();
  valores = {
    egresos: 0,
    ingresos: 0,
    cantIngresos: 0,
    cantEgresos: 0,
  };
  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: SingleDataSet = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso').subscribe((data) => {
      this.calcular(data.items);
    });
  }

  calcular(items: IngresoEgreso[]) {
    this.valores = {
      egresos: 0,
      ingresos: 0,
      cantIngresos: 0,
      cantEgresos: 0,
    };

    items.forEach((item: IngresoEgreso) => {
      if (item.tipo === 'ingreso') {
        this.valores.cantIngresos++;
        this.valores.ingresos += item.monto;
      } else {
        this.valores.cantEgresos++;
        this.valores.egresos += item.monto;
      }
    });
    this.doughnutChartData = [this.valores.ingresos, this.valores.egresos];
  }
}
