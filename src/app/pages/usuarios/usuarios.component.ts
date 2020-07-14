import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/service.index';
import { PAGINACION, CAMBIOPAGINA } from '../../config/config';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  paginacion: number = PAGINACION;
  cambio: number = CAMBIOPAGINA;
  desde: number = 0;
  isDisabledSiguientes: boolean = true;
  isDisabledAnteriores: boolean = true;

  registrosActuales: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe((resp) =>
      this.cargarUsuarios()
    );
  }

  mostrarModal(usuario: Usuario) {
    this._modalUploadService.mostrarModal('usuarios', usuario._id, usuario.img);
  }

  controlBotonesPaginacion() {
    if (
      this.usuarios.length !== this.cambio ||
      this.registrosActuales === this.totalRegistros
    ) {
      this.isDisabledSiguientes = false;
    } else {
      this.isDisabledSiguientes = true;
    }
    if (this.paginacion === 0) {
      this.isDisabledAnteriores = false;
    } else {
      this.isDisabledAnteriores = true;
    }
  }

  cargarUsuarios() {
    this._usuarioService
      .cargarUsuarios(this.paginacion)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
        this.registrosActuales = this.usuarios.length + this.paginacion;
        this.controlBotonesPaginacion();
      });
  }

  cambiarDesde(valor: number) {
    const desde = this.paginacion + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }
    this.paginacion += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    if (termino.trim() === '') {
      return;
    }
    this.cargando = true;

    this._usuarioService
      .buscarUsuarios(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
        console.log(usuarios);
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioService.usuario._id) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Eliminar Usuario',
        text: 'No se puede eliminar a usted mismo',
      });
      return;
    }
    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((dato) => {
      if (dato.value) {
        this._usuarioService.borrarUsuario(usuario._id).subscribe((resp) => {
          if (this.usuarios.length === 1) {
            this.paginacion = this.paginacion - 5;
          }
          this.cargarUsuarios();
        });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }
}
