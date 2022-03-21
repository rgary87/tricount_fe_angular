import {Component, Inject, OnInit, SimpleChanges} from '@angular/core';
import {TripService, TripToJSON} from "../services/trip.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataStorageService} from "../services/data-storage.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {DataAccessService} from "../services/data-access.service";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  public trip: TripService = new TripService();
  // private _entireTrip: TripService;
  title = 'tricount';
  display_base_page = true;

  constructor(private http: HttpClient,
              public app: AppComponent,
              private dataStorageService: DataStorageService,
              private access: DataAccessService) {
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      console.log("Trip refreshed in main-component with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_refunds, value.number_of_refunds_on_participants);
      this.trip = value;
    });
  }

  mustDisplayAll() {
    return false;
    // return this.display_base_page;
  }

  onSubmitForCalculation(): void {
    this.access.updateTripOnModify(this.trip);
  }

  ngOnInit(): void {
  }

  removeUser(name: string) {
    this.dataStorageService.removeParticipant(name);
  }

  removeSpending(idx:number) {
    this.dataStorageService.removeSpending(idx);
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log("change happened...");
  }

  getOwedBarSize(participantName: string): number {
    let p = this.trip.participant_list.filter(p => p.name === participantName)[0];
    if (p.owe_amount < 0) {
      return 0;
    }
    let maxAmount = 0.1;
    for (const participant of this.trip.participant_list) {
      if (maxAmount < participant.owe_amount) {
        maxAmount = participant.owe_amount;
      }
    }
    return p.owe_amount / maxAmount;
  }

  getRefundBarSize(participantName: string):number {
    let p = this.trip.participant_list.filter(p => p.name === participantName)[0];
    if (p.owe_amount > 0) {
      return 0;
    }
    let maxAmount = 0.1;
    for (const participant of this.trip.participant_list) {
      if (maxAmount < -participant.owe_amount) {
        maxAmount = -participant.owe_amount;
      }
    }
    return -p.owe_amount / maxAmount;
  }

  refresh(): void {
    this.access.retrieveTripFromServer();
  }

}

