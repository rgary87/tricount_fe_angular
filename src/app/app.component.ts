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
  get entireTrip(): TripService {
    let trip = this.dataStorageService.getTrip();
    // console.log("Is init: " + trip.isInit);
    this.isInit = trip.isInit;
    return trip;
  }

  private _entireTrip: TripService;
  title = 'tricount';
  display_base_page = true;
  public isInit: boolean = false;

  constructor(private http: HttpClient,
              private dataStorageService: DataStorageService) {
    this._entireTrip = dataStorageService.getTrip();
    this.isInit = this._entireTrip.isInit;
  }

  mustDisplayAll() {
    return false;
    // return this.display_base_page;
  }

  onSubmitForCalculation(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.post<TripService>(DataStorageService.BACKEND_URL + "/trip/calculation", JSON.stringify(this.dataStorageService.getTrip()), {headers: headers}).subscribe(data => {
      // data.participant_list.sort((a, b) => b.total_spent - a.total_spent);
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
    console.log("Data: %o", this.dataStorageService.getTrip());
  }
}
