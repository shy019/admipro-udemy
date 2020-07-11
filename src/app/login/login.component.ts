import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  recuerdame = false;
  email: string;
  auth2: any;
  constructor(public router: Router, public _usuarioService: UsuarioService, public _ngZone: NgZone) {}

  ngOnInit(): void {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 0) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '511352038798-pn6tsi8b4phlm8sv8vb2f5srtgk4pgsc.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email',
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;

      this._usuarioService
        .loginGoogle(token)
        .subscribe(() =>  this._ngZone.run(() => this.router.navigate(['/dashboard'])))
    })
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Datos Incorrectos',
        text: 'Something went wrong!',
        footer: '<a href>Why do I have this issue?</a>',
      });
      return;
    }

    let usuario = new Usuario(null, forma.value.email, forma.value.password);

    this._usuarioService
      .login(usuario, forma.value.recuerdame)
      .subscribe((correcto) => this.router.navigate(['/dashboard']));
  }
}
