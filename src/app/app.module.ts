import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { AppComponent } from './app.component';
import { AddPersonComponent } from './add-person/add-person.component';
import {ReactiveFormsModule} from "@angular/forms";
import { CreateTripComponent } from './create-trip/create-trip.component';
import {AddSpendingComponent, DialogModifySpending} from './add-spending/add-spending.component';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddRefundComponent } from './add-refund/add-refund.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatCommonModule} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent,
    AddPersonComponent,
    CreateTripComponent,
    AddSpendingComponent,
    AddRefundComponent,
    DialogModifySpending
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatGridListModule,
    MatToolbarModule,
    MatSelectModule
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
