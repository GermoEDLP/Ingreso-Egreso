import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  cargando: boolean = false;
  sub: Subscription = new Subscription();

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
    this.authService.crearUsuario( data.nombre, data.email, data.password );
  }

}
