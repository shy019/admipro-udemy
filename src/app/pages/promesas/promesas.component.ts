import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [],
})
export class PromesasComponent implements OnInit {
  constructor() {
    this.contarTres()
      .then((mes) => console.log('termino', mes))
      .catch((error) => console.error('error promiess', error));
  }

  ngOnInit(): void {}

  contarTres(): Promise<boolean> {
    return new Promise((res, rej) => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador += 1;
        if (contador === 3) {
          //rej('un simple error');
          res(true);
          clearInterval(intervalo);
        }
      }, 1000);
    });
  }
}
