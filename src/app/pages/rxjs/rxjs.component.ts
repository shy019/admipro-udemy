import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
})
export class RxjsComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable()
      .pipe(retry(2))
      .subscribe(
        (numero) => console.log('Subs ', numero),
        (error) => console.error('se toteo', error),
        () => console.log('termino')
      );
  }

  regresaObservable(): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let contador = 0;
      let intervalo = setInterval(() => {
        contador += 1;
        if (contador === 3) {
          clearInterval(intervalo);
          observer.complete();
        }
        const salida = {
          valor: contador,
        };
        observer.next(salida);
        // if (contador === 2) {
        //   clearInterval(intervalo);
        //   observer.error('aux');
        // }
      }, 1000);
    }).pipe(
      map((resp) => resp.valor),
      filter((valor, index) => {
        if (valor % 2 === 1) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
