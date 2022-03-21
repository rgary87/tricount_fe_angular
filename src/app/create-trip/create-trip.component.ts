import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {MainPageComponent} from "../main-page/main-page.component";
import {TripService} from "../services/trip.service";
import {DataAccessService} from "../services/data-access.service";

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {

  // @ts-ignore
  public trip: TripService;

  constructor(
    private formBuilder: FormBuilder,
    private mainPage: MainPageComponent,
    private dataStorageService: DataStorageService,
    private access: DataAccessService,
  ) {
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      console.log("Trip refreshed in add-spending  with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_refunds, value.number_of_refunds_on_participants);
      this.trip = value;
    });
  }

  createTripForm = this.formBuilder.group( {
    days: 1
  })

  onSubmit(): void {
    this.trip.isInit = true;
    this.trip.default_number_of_days = this.createTripForm.value['days'];
    this.access.createTrip(this.trip);
    this.createTripForm.reset();
  }

  ngOnInit(): void {
  }

}
