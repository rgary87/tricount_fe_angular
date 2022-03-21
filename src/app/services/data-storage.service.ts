import {Injectable, OnInit} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {PersonService} from "./person.service";
import {TripService} from "./trip.service";
import {SpendingService} from "./spending.service";
import {RefundService} from "./refund.service";
import { BehaviorSubject } from 'rxjs';
import {DataAccessService} from "./data-access.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService implements OnInit {

  private participant_list_key: string = "PARTICIPANT_LIST";
  private trip_info_key: string = "TRIP_INFO";
  private updated: boolean = true;

  public tripBehaviorSubject: BehaviorSubject<TripService> = new BehaviorSubject<TripService>(new TripService());

  // @ts-ignore
  private trip: TripService;

  constructor(private localStorage: LocalStorageService,
              private access: DataAccessService) {
    this.getTrip();
    console.log('Storage Built');
    this.access.dataObservable?.subscribe(value => this.setTrip(value));
  }

  ngOnInit(): void {

  }

  getParticipantList(): PersonService[] {
    let list = this.localStorage.get(this.participant_list_key);
    if (list) {
      return JSON.parse(list);
    }
    return [];
  }

  private getTrip(): void {
    console.log('In getTrip');
    if (!this.updated) {
      console.log('Not updated');
      return;
    }
    this.updated = false;
    let string_trip = this.localStorage.get(this.trip_info_key);
    if (string_trip) {
      let trip = JSON.parse(string_trip);
      DataAccessService.UUID = trip.uuid;
      this.access.retrieveTripFromServer();
      console.log('Got trip from storage with uuid: %o', trip.uuid);
      return;
    }
    return;
  }

  setParticipantList(list: PersonService[]): void {
    this.localStorage.set(this.participant_list_key, JSON.stringify(list));
    this.updated = true;
  }

  private setTrip(trip: TripService): void {
    // console.trace();
    console.log('In Set Trip')
    if (!trip.isInit) return;
    console.log('Save trip uuid: %o', trip.uuid);
    trip.refund_list = [];
    trip.number_of_spendings = trip.spending_list.length;
    trip.number_of_participants = trip.participant_list.length;
    trip.number_of_refunds = trip.refund_list.length;

    let number_of_refunds_on_participants = 0;
    trip.participant_list.forEach(p => {
      number_of_refunds_on_participants += p.refund_to.length;
      p.refund_to.forEach(r => r.done = false);
    });
    trip.number_of_refunds_on_participants = number_of_refunds_on_participants;

    this.localStorage.set(this.trip_info_key, JSON.stringify(trip));
    this.trip = trip;
    this.tripBehaviorSubject.next(trip);
    this.updated = true;
  }

  addParticipant(person: PersonService): void {
    this.trip.participant_list.push(person);
    this.access.updateTripOnModify(this.trip);
  }

  addSpending(spending: SpendingService): void {
    console.log("Store spending");
    this.trip.spending_list.push(spending);
    this.access.updateTripOnModify(this.trip);
  }

  addRefund(refund: RefundService): void {
    console.log("Store refund");
    this.trip.refund_list.push(refund);
    this.access.updateTripOnModify(this.trip);
  }

  removeParticipant(name: string): void {
    console.log("Remove participant %o", name);
    let filtered = this.trip.participant_list.filter(function (v, i, a) {
      return v.name !== name;
    });
    this.trip.participant_list = filtered;
    this.access.updateTripOnModify(this.trip);
  }

  removeSpending(idx: number): void {
    console.log("Remove spending %o", idx);
    this.trip.spending_list = this.trip.spending_list.filter(s => s.idx !== idx);
    this.access.updateTripOnModify(this.trip);
  }

  reset():void {
    this.updated = true;
    this.localStorage.remove(this.trip_info_key);
    this.access.createTrip(new TripService());
  }

  refresh():void {
    this.trip.refund_list = [];
    this.setTrip(this.trip);
    this.tripBehaviorSubject.next(this.trip);
  }


}
