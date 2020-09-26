import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {NgxMasonryModule} from 'ngx-masonry';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatStepperModule} from '@angular/material/stepper';



@NgModule({
  declarations: [],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatDatepickerModule,
    MatStepperModule,
    MatInputModule,
    CommonModule,
    NgxMasonryModule,
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatStepperModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMasonryModule
  ]
})
export class MaterialsModule { }
