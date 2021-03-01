import { ActionReducerMap } from '@ngrx/store';
import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

// Esta es el estado total de mi aplicación, es decir, como se verá el objeto Store completo
export interface AppState{
  ui: fromUI.State,
  auth: fromAuth.AuthState
}

// Aqui configuramos el mapeo del estado. El tipo que retorna es con la forma del AppState
export const appReducers: ActionReducerMap<AppState> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer
}
