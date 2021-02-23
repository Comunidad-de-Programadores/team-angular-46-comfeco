import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'comfeco-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ViewLoginComponent implements OnInit {

  flagInicioRegistro: boolean = true;
  body: string = "inicio sesión";

  constructor() { }

  ngOnInit(): void {
  }

  changeViewInicioRegistro(flag){

    this.flagInicioRegistro = flag;
    this.body = this.flagInicioRegistro ? 'inicio sesión' : 'registro'

  }

}
