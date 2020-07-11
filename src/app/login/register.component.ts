import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css'],
})
export class RegisterComponent implements OnInit {
  forma: FormGroup;

  constructor(public _usuarioService: UsuarioService,
              public router: Router) {}

  igualdad(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 == pass2) {
        return null;
      }
      return {
        Iguales: true,
      };
    };
  }

  ngOnInit(): void {
    init_plugins();

    this.forma = new FormGroup(
      {
        nombre: new FormControl(null, Validators.required),
        correo: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, Validators.required),
        password2: new FormControl(null, Validators.required),
        condiciones: new FormControl(false),
      },
      { validators: this.igualdad('password', 'password2') }
    );

    this.forma.setValue({
      nombre: 'Cristian',
      correo: 'cristianpg123@hotmail.com',
      password: '123',
      password2: '1234',
      condiciones: true,
    });
  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    }
    if (!this.forma.value.condiciones) {
      Swal.fire({
        title: 'Importante',
        text: 'Debes aceptar los terminos y condiciones',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, cancel!',
        confirmButtonText: 'Ok',
      });
      return;
    }
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario(usuario).subscribe(resp => this.router.navigate(['/login']));
  }
}
