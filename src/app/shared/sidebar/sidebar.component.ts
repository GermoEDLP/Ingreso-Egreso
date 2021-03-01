import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { User } from 'src/app/auth/user.model';
import { IngresoEgresoService } from 'src/app/ingreso-egreso/ingreso-egreso.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  user: User;
  subs: Subscription = new Subscription();

  constructor(
    public authService: AuthService,
    private store: Store<AppState>,
    private ingresoEgresoSvc: IngresoEgresoService
  ) {}

  ngOnInit() {
    this.subs = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe((auth) => {
        this.user = auth.user;
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.ingresoEgresoSvc.cancelarSubs();
  }
}
