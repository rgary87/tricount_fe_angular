import {Injectable, OnDestroy} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {PersonService} from "./person.service";
import {TripService, TripToJSON} from "./trip.service";
import {SpendingService} from "./spending.service";
import {RefundService} from "./refund.service";
import { interval, Subscription, BehaviorSubject } from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService implements OnDestroy {

  private participant_list_key: string = "PARTICIPANT_LIST";
  private trip_info_key: string = "TRIP_INFO";
  private updated: boolean = true;

  public tripBehaviorSubject: BehaviorSubject<TripService> = new BehaviorSubject<TripService>(new TripService());
  private trip: TripService;

  public static BACKEND_URL:string ;

  subs: Subscription;

  constructor(private localStorage: LocalStorageService,
              private http: HttpClient,) {
    if (window.location.href.indexOf("localhost") === -1 && window.location.href.indexOf("127.0.0.1") === -1) {
      DataStorageService.BACKEND_URL = 'http://serversuccu.serveftp.com:3000';
    } else {
      DataStorageService.BACKEND_URL = 'http://127.0.0.1:3000';
    }
    this.trip = new TripService();
    this.tripBehaviorSubject.next(this.getTrip());
    console.log("BACKEND URL C: %o", DataStorageService.BACKEND_URL);

    const source = interval(20000);
    this.subs = source.subscribe(n => this.retrieveTripFromServer(this.trip.uuid));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getParticipantList(): PersonService[] {
    let list = this.localStorage.get(this.participant_list_key);
    if (list) {
      return JSON.parse(list);
    }
    return [];
  }

  private createTrip(): TripService {
    console.log("New Trip altogether");
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.post<TripService>(DataStorageService.BACKEND_URL+"/trip/create", TripToJSON(this.trip), {headers: headers}).subscribe(data => {
      console.log("Called for create trip. Got %o", data);
      this.setTrip(data);
    });
    return this.trip;
  }

  private getTrip(): TripService {
    if (!this.updated) {
      console.log("Not updated: %o", this.trip);
      return this.trip;
    }
    this.updated = false;
    let string_trip = this.localStorage.get(this.trip_info_key);
    if (string_trip) {
      console.log("Trip from storage");
      this.trip = JSON.parse(string_trip);
      return this.trip;
    }
    return this.createTrip();
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
    console.log("Stored value: %o", trip);
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
    this.setTrip(this.createTrip());
  }

  refresh():void {
    this.trip.refund_list = [];
    this.setTrip(this.trip);
    this.tripBehaviorSubject.next(this.trip);
  }

  retrieveTripFromServer(uuid: string): void {
    this.http.get<TripService>(DataStorageService.BACKEND_URL+"/trip/"+uuid, { observe: 'response' }).subscribe(data => {
      console.log("Full Response: %o", data);
      if (data.status === 404) {
        console.log("Trip do not exists in DB.")
        return;
      }
      console.log("Called for retrieve trip. Got %o", data);
      this.setTrip(data.body!);
    });
  }

}
