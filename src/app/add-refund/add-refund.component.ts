import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TripService} from "../services/trip.service";
import {RefundService} from "../services/refund.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MainPageComponent} from "../main-page/main-page.component";
import {DataAccessService} from "../services/data-access.service";


@Component({
  selector: 'app-add-refund',
  templateUrl: './add-refund.component.html',
  styleUrls: ['./add-refund.component.css']
})
export class AddRefundComponent implements OnInit {

  public trip: TripService = new TripService();

  _all_refunds: RefundService[] = [];
  refundsColumns: string[] = ['from', 'to', 'amount', 'done', 'idx', 'update'];

  get all_refunds(): RefundService[] {
    this.refreshRefunds();
    return this._all_refunds;
  }

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private mainPage: MainPageComponent,
    public dataStorageService: DataStorageService,
    public access: DataAccessService,
  ) {
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      this.trip = value;
      // console.log("Trip refreshed in add-refund    with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_refunds, value.number_of_refunds_on_participants);
      this.refreshRefunds();
    });
  }

  refreshRefunds() {
    this._all_refunds = [];
    this.trip.participant_list.forEach(p => p.refund_to.forEach(r => this._all_refunds.push(r)));
  }

  updateRefund(idx: number, done: boolean): void {
    let found = false;
    for (const participant of this.trip.participant_list) {
      for (const refundService of participant.refund_to) {
        if (refundService.idx === idx) {
          refundService.done = done;
          found = true;
        }
      }
    }
    if (!found) {
      throw "what are you trying to do here ?...";
    }
    this.refreshRefunds();


    this.access.updateTripOnModify(this.trip);
  }

  ngOnInit(): void {
  }

  openRefundDialog(idx: number) {
    for (const participant of this.trip.participant_list) {
      for (const refundService of participant.refund_to) {
        if (refundService.idx === idx) {
          const dialogRef = this.dialog.open(DialogModifyRefund, {data: {refund: refundService, trip: this.trip}});
          dialogRef.afterClosed().subscribe(r => {this.mainPage.onSubmitForCalculation()});
          return;
        }
      }
    }
  }

}

interface RefundDialogData {
  refund: RefundService,
  trip: TripService
}

@Component({
  selector: 'dialog-modify-refund',
  templateUrl: './dialog-modify-refund.html'
})
export class DialogModifyRefund {
  public trip: TripService;
  public refund: RefundService;

  constructor(
    public dialogRef: MatDialogRef<DialogModifyRefund>,
    public dataStorageService: DataStorageService,
    public formBuilder : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: RefundDialogData,
  ) {
    this.refund = data.refund;
    this.trip = data.trip;

  }



  confirmRefund() {
    console.log("CONFIRMED REFUND #%o", this.refund.idx);
  }

}
