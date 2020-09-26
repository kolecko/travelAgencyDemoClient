import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeSk from '@angular/common/locales/sk';


import {HttpClientModule} from '@angular/common/http';
import {DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS} from 'saturn-datepicker';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OffersComponent} from './offers/offers.component';
import {OfferComponent} from './offers/offer/offer.component';
import {MaterialsModule} from './materials/materials.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


registerLocaleData(localeSk, 'sk_SK');

@NgModule({
  declarations: [
    AppComponent,
    OffersComponent,
    OfferComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'sk_SK'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
