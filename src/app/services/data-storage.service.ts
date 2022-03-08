import { Injectable } from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {PersonService} from "./person.service";
import {TripService} from "./trip.service";
import {SpendingService} from "./spending.service";
import {RefundService} from "./refund.service";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  private participant_list_key: string = "PARTICIPANT_LIST";
  private trip_info_key: string = "TRIP_INFO";
  private updated: boolean = true;

  public tripBehaviorSubject: BehaviorSubject<TripService> = new BehaviorSubject<TripService>(new TripService());
  private trip: TripService = this.getTrip();

  public static BACKEND_URL:string ;

  constructor(private localStorage: LocalStorageService,
              ) {
    this.tripBehaviorSubject.next(this.getTrip());
    if (window.location.href.indexOf("localhost") === -1 && window.location.href.indexOf("127.0.0.1") === -1) {
      DataStorageService.BACKEND_URL = 'http://serversuccu.serveftp.com:3000';
    } else {
      DataStorageService.BACKEND_URL = 'http://127.0.0.1:3000';
    }
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
    return new TripService();
  }

  setParticipantList(list: PersonService[]): void {
    this.localStorage.set(this.participant_list_key, JSON.stringify(list));
    this.updated = true;
  }

  setTrip(trip: TripService): void {
    trip.number_of_spendings = trip.spending_list.length;
    trip.number_of_participants = trip.participant_list.length;
    trip.number_of_refunds = trip.participant_list.length;

    let number_of_refunds_on_participants = 0;
    trip.participant_list.forEach(p => number_of_refunds_on_participants += p.refund_to.length);
    trip.number_of_refunds_on_participants = number_of_refunds_on_participants;

    this.localStorage.set(this.trip_info_key, JSON.stringify(trip));
    console.log("Stored value: %o", trip);
    this.tripBehaviorSubject.next(trip);
    this.updated = true;
  }

  addParticipant(person: PersonService): void {
    let trip = this.getTrip();
    console.log("Store participant");
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
    this.setTrip(new TripService());
  }

  refresh():void {
    this.tripBehaviorSubject.next(this.trip);
  }
}
