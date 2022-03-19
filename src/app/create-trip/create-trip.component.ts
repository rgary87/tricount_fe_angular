import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {MainPageComponent} from "../main-page/main-page.component";

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private mainPage: MainPageComponent,
    private dataStorageService: DataStorageService
  ) { }

  createTripForm = this.formBuilder.group( {
    days: 1
  })

  onSubmit(): void {
    this.dataStorageService.setDefaultDayCount(this.createTripForm.value['days']);
    this.createTripForm.reset();
    this.mainPage.isInit = true;
  }

  ngOnInit(): void {
  }

}
