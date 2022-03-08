import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TripService} from "./services/trip.service";
import {DataStorageService} from "./services/data-storage.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {

  public trip: TripService = new TripService();
  // private _entireTrip: TripService;
  title = 'tricount';
  display_base_page = true;
  public isInit: boolean = false;

  constructor(private http: HttpClient,
              private dataStorageService: DataStorageService) {
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      console.log("Trip refreshed in app-component with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_participants, value.number_of_refunds_on_participants);
      this.trip = value;
      this.isInit = this.trip.isInit;
    });
    this.dataStorageService.refresh();
  }

  mustDisplayAll() {
    return false;
    // return this.display_base_page;
  }

  onSubmitForCalculation(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.post<TripService>(DataStorageService.BACKEND_URL + "/trip/calculation", JSON.stringify(this.trip), {headers: headers}).subscribe(data => {
      console.log("Called for calculation. Got %o", data);
      this.dataStorageService.setTrip(data);
    })
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


  reset(): void{
    this.dataStorageService.reset();
    this.isInit = false;
    location.reload();
  }

  print_data(): void {
    console.log("Data: %o", this.trip);
  }
}
