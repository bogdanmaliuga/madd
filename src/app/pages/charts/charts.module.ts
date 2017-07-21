import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing }       from './charts.routing';
import { Charts } from './charts.component';
import { ChartistJs } from './components/chartistJs/chartistJs.component';
import { ChartistJsService } from './components/chartistJs/chartistJs.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule
  ],
  declarations: [
    Charts,
    ChartistJs
  ],
  providers: [
    ChartistJsService
  ]
})
export class ChartsModule {}
