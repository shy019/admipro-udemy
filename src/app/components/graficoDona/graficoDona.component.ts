import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './graficoDona.component.html',
  styles: [],
})
export class GraficoDonaComponent implements OnInit {
  @Input() graficos: any;

  constructor() {}

  ngOnInit(): void {}
}
