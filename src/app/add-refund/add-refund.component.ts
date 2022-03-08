import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TripService} from "../services/trip.service";
import {RefundService} from "../services/refund.service";

@Component({
  selector: 'app-add-refund',
  templateUrl: './add-refund.component.html',
  styleUrls: ['./add-refund.component.css']
})
export class AddRefundComponent implements OnInit {

  public trip: TripService = new TripService();

  createRefundForm: FormGroup;

  _all_refunds: RefundService[] = [];

  get all_refunds(): RefundService[] {
    this.refreshRefunds();
    return this._all_refunds;
  }

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private appComponent: AppComponent,
    public dataStorageService: DataStorageService
  ) {
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      this.trip = value;
      console.log("Trip refreshed in add-refund    with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_participants, value.number_of_refunds_on_participants);
      this.refreshRefunds();
    });
    this.trip.participant_list.forEach(p => p.refund_to.forEach(r => this._all_refunds.push(r)));
    this.createRefundForm = this.formBuilder.group({})
  }

  refreshRefunds() {
    this._all_refunds = [];
    this.trip.participant_list.forEach(p => p.refund_to.forEach(r => this._all_refunds.push(r)));
    this.createRefundForm = this.formBuilder.group({})
  }

  onSubmit(from: string, to: string): void {
    let participant = this.trip.participant_list.filter(p => p.name === from);
    if (participant.length !== 1) {
      throw "what are you trying to do here ?...";
    }

    let refundTo = participant[0].refund_to.filter(r => r.to === to);
    if (refundTo.length !== 1) {
      throw "what are you trying to do here ?...";
    }

    let maxIdx = 0;
    this.trip.refund_list.forEach(r => {
      if (r.idx >= maxIdx) {
        maxIdx = r.idx + 1;
      }
    });
    refundTo[0].idx = maxIdx;

    this.dataStorageService.addRefund(refundTo[0]);

    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.post<TripService>(DataStorageService.BACKEND_URL + "/trip/addRefund", JSON.stringify(this.trip), {headers: headers}).subscribe(data => {
      this.dataStorageService.setTrip(data);
      console.log("AddRefund response: %o", data);
      this.refreshRefunds();
    });
  }

  removeRefund(idx: number, from: string, to: string): void {
    let trip = this.trip;
    let filtered = trip.refund_list.filter(r => r.idx !== idx);
    for (const participant of trip.participant_list) {
      if (participant.name === from) {
        for (const refund of participant.refund_to) {
          if (refund.to === to) {
            refund.done = false;
          }
        }
      }
    }
    trip.refund_list = filtered;
    this.dataStorageService.setTrip(trip);
  }

  ngOnInit(): void {
  }

}
