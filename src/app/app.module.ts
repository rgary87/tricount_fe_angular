import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { AppComponent } from './app.component';
import { AddPersonComponent } from './add-person/add-person.component';
import {ReactiveFormsModule} from "@angular/forms";
import { CreateTripComponent } from './create-trip/create-trip.component';
import { AddSpendingComponent } from './add-spending/add-spending.component';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddRefundComponent } from './add-refund/add-refund.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@NgModule({
  declarations: [
    AppComponent,
    AddPersonComponent,
    CreateTripComponent,
    AddSpendingComponent,
    AddRefundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    BrowserAnimationsModule
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
