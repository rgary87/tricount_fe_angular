import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {AppComponent, DialogSharePage} from './app.component';
import {AddPersonComponent, DialogModifyPerson} from './add-person/add-person.component';
import {ReactiveFormsModule} from "@angular/forms";
import { CreateTripComponent } from './create-trip/create-trip.component';
import {AddSpendingComponent, DialogModifySpending} from './add-spending/add-spending.component';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AddRefundComponent, DialogModifyRefund} from './add-refund/add-refund.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatCommonModule} from "@angular/material/core";
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSelectModule} from "@angular/material/select";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatSortModule} from "@angular/material/sort";
import {EuroPipe} from "./pipe/EuroPipe";
import {RouterModule, Routes} from "@angular/router";
import { UuidComponent } from './uuid/uuid.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MatIconModule} from "@angular/material/icon";
import { FaqComponent } from './faq/faq.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  declarations: [
    AppComponent,
    AddPersonComponent,
    CreateTripComponent,
    AddSpendingComponent,
    AddRefundComponent,
    UuidComponent,
    DialogModifySpending,
    DialogModifyPerson,
    DialogModifyRefund,
    DialogSharePage,
    EuroPipe,
    MainPageComponent,
    FaqComponent,
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
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    RouterModule.forRoot([
        {path: 'faq', component: FaqComponent},
        {path: ':uuid', component: UuidComponent},
        {path: '', component: MainPageComponent, pathMatch: 'full'},
      ]
      // , {enableTracing: true}
    ),
    MatIconModule,
    MatExpansionModule,
    MatDividerModule
  ],
  exports: [RouterModule],
  providers: [AppComponent, AddRefundComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
