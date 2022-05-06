import {Injectable, OnDestroy} from '@angular/core';
import {TripService, TripToJSON} from "./trip.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, interval, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataAccessService implements OnDestroy {

  public static BACKEND_URL: string;

  public dataObservable: BehaviorSubject<TripService> = new BehaviorSubject<TripService>(new TripService());

  public static UUID: string = '';

  public subs: Subscription;

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');


  constructor(private http: HttpClient) {
    DataAccessService.BACKEND_URL = window.location.protocol + '//' + window.location.hostname + ':3000';
    const source = interval(20000);
    this.subs = source.subscribe(n => this.retrieveTripFromServer());
  }


  public createTrip(trip: TripService): void {
    console.log("Create a new trip");
    this.http.post<TripService>(DataAccessService.BACKEND_URL + "/trip/create", TripToJSON(trip), {headers: this.headers}).subscribe(data => {
      console.log("Called for create trip. Got %o", data);
      DataAccessService.UUID = data.uuid;
      this.dataObservable?.next(data);
    });
  }

  public retrieveTripFromServer(): void {
    if (DataAccessService.UUID === '') {
      console.log('No UUID exists, return');
      return;
    }
    console.log('Get a trip from backend');
    this.http.get<TripService>(DataAccessService.BACKEND_URL + "/trip/" + DataAccessService.UUID, {observe: 'response'}).subscribe(data => {
      if (data.status === 404) {
        console.log("Trip do not exists in DB.")
        return;
      }
      this.dataObservable?.next(data.body!);
    });
  }

  public updateTripOnModify(trip: TripService): void {
    console.log('Update a trip in backend');
    this.http.post<TripService>(DataAccessService.BACKEND_URL + "/trip/calculation", TripToJSON(trip), {headers: this.headers}).subscribe(data => {
      console.log("Called for calculation. Got %o", data);
      DataAccessService.UUID = trip.uuid;
      this.dataObservable?.next(data);
    });
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
