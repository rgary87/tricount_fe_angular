import {Injectable} from '@angular/core';
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
export class DataStorageService {

  private participant_list_key: string = "PARTICIPANT_LIST";
  private trip_info_key: string = "TRIP_INFO";
  private updated: boolean = true;

  public tripBehaviorSubject: BehaviorSubject<TripService> = new BehaviorSubject<TripService>(new TripService());
  private trip: TripService;

  constructor(private localStorage: LocalStorageService,
              private access: DataAccessService) {

    this.trip = new TripService();
    this.tripBehaviorSubject.next(this.getTrip());

    this.access.dataObservable.subscribe(value => this.setTrip(value));
  }

  getParticipantList(): PersonService[] {
    let list = this.localStorage.get(this.participant_list_key);
    if (list) {
      return JSON.parse(list);
    }
    return [];
  }

  private getTrip(): TripService {
    if (!this.updated) {
      return this.trip;
    }
    this.updated = false;
    let string_trip = this.localStorage.get(this.trip_info_key);
    if (string_trip) {
      this.trip = JSON.parse(string_trip);
      return this.trip;
    }
    this.access.createTrip(this.trip);
    return this.trip;
  }

  setParticipantList(list: PersonService[]): void {
    this.localStorage.set(this.participant_list_key, JSON.stringify(list));
    this.updated = true;
  }

  setTrip(trip: TripService): void {
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
    this.tripBehaviorSubject.next(trip);
    this.updated = true;
  }

  addParticipant(person: PersonService): void {
    let trip = this.getTrip();
    trip.participant_list.push(person);
    this.setTrip(trip);
  }

  addSpending(spending: SpendingService): void {
    let trip = this.getTrip();
    console.log("Store spending");
    trip.spending_list.push(spending);
    this.setTrip(trip);
  }

  addRefund(refund: RefundService): void {
    let trip = this.getTrip();
    console.log("Store refund");
    trip.refund_list.push(refund);
    this.setTrip(trip);
  }

  removeParticipant(name: string): void {
    let trip = this.getTrip();
    console.log("Remove participant %o", name);
    let filtered = trip.participant_list.filter(function (v, i, a) {
      return v.name !== name;
    });
    trip.participant_list = filtered;
    this.setTrip(trip);
  }

  removeSpending(idx: number): void {
    let trip = this.getTrip();
    console.log("Remove spending %o", idx);
    trip.spending_list = trip.spending_list.filter(s => s.idx !== idx);
    this.setTrip(trip);
  }

  setDefaultDayCount(days: number): void {
    let trip = this.getTrip();
    trip.isInit = true;
    trip.default_number_of_days = days;
    this.setTrip(trip);
  }

  reset():void {
    this.updated = true;
    this.access.createTrip(new TripService());
  }

  refresh():void {
    this.trip.refund_list = [];
    this.setTrip(this.trip);
    this.tripBehaviorSubject.next(this.trip);
  }


}
