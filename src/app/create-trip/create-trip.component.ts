import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private appComponent: AppComponent,
    private dataStorageService: DataStorageService
  ) { }

  createTripForm = this.formBuilder.group( {
    days: 1
  })

  onSubmit(): void {
    this.dataStorageService.setDefaultDayCount(this.createTripForm.value['days']);
    this.createTripForm.reset();
    this.appComponent.isInit = true;
  }

  ngOnInit(): void {
  }

}
