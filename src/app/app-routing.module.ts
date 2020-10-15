import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [

  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {
    path: 'main',
    component: MainComponent,
  }
]

// useHash : https://medium.com/code-divoire/angular-le-pi%C3%A8ge-du-hash-90212ab883aa
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
