import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean = false;
  sub: Subscription;

  constructor( public authService: AuthService , public store: Store<AppState>) {

  }

  ngOnInit() {
    this.sub = this.store.select('ui').subscribe((ui)=>{
      this.cargando = ui.isLoading;
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  onSubmit( data: any ) {

    console.log(data);

    this.authService.login( data.email, data.password );

  }

}
