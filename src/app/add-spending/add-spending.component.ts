import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {PersonService} from "../services/person.service";
import {SpendingService} from "../services/spending.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TripService} from "../services/trip.service";
import {MainPageComponent} from "../main-page/main-page.component";

interface FormOption {
  value: string;
  viewValue: string;
}

interface DialogData {
  spending: SpendingService,
  trip: TripService
}

@Component({
  selector: 'app-add-spending',
  templateUrl: './add-spending.component.html',
  styleUrls: ['./add-spending.component.css']
})
export class AddSpendingComponent implements OnInit {

  public updated: boolean = false;

  private trip: TripService = new TripService();
  spending_list: SpendingService[] = [];
  participant_list: PersonService[] = [];

  createSpendingForm: FormGroup = this.formBuilder.group({});
  private _participantListForm: FormGroup = this.formBuilder.group({});

  public spendingsColumns: string[] = ['amount', 'paid_by', 'reason', 'for'];
  private _participantSelectOptions: FormOption[] = [];
  public payer: string = '';
  public amount: number = 0;
  public amountControl: FormControl;
  public payerControl: FormControl;

  get participantListForm(): FormGroup {
    this.refreshParticipants();
    return this._participantListForm;
  }

  get participantSelectOptions() {
    return this._participantSelectOptions;
  }

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public mainPage: MainPageComponent,
    public dataStorageService: DataStorageService,
    public dialog: MatDialog,
  ) {
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      console.log("Trip refreshed in add-spending  with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_refunds, value.number_of_refunds_on_participants);
      this.trip = value;
      this.spending_list = this.trip.spending_list.sort(((a, b) => a.payed_by.localeCompare(b.payed_by) ));
      this.participant_list = this.trip.participant_list;
      this.refreshSelect();
      this.refreshParticipants();
      this.updated = !this.updated;
    });
    this.amountControl = new FormControl('', [Validators.required, Validators.min(1)]);
    this.amountControl.setValue(1);
    this.payerControl = new FormControl('', [Validators.required]);
    this.refreshParticipants();
    this.refreshSelect();
  }

  refreshSelect() {
    this._participantSelectOptions = []
    for (const participant of this.participant_list) {
      this._participantSelectOptions.push({value: participant.name, viewValue:participant.name})
    }
  }

  refreshParticipants():void {
    if (this.createSpendingForm.get('participants') === null) {
      this.createForm();
    }
    this._participantListForm = <FormGroup>this.createSpendingForm.get('participants');
    this._participantListForm.addControl('All', new FormControl(true))
    this.participant_list.forEach((p: PersonService) => {
      this._participantListForm.addControl(p.name, new FormControl(true))
    });
  }

  onSubmit(): void {
    let group = <FormGroup>this.createSpendingForm.get('participants');

    let sharedWith = [];

    let sharedToAll = group.get('All')?.value;
    if (sharedToAll) {

    }
    for (let p of this.participant_list) {
      let shared = group.get(p.name);
      if (sharedToAll || shared?.value) {
        sharedWith.push(p.name);
      }
      console.log("Participant " + p.name + (shared?.value ? " do " : " doesn't ") + "share this spending");
    }
    let maxIndex = 0;
    this.spending_list.forEach(s => {
      if (s.idx >= maxIndex) {
        maxIndex = s.idx + 1;
      }});

    let spending = new SpendingService();
    spending.amount = this.amountControl.value;
    spending.payed_by = this.payer;
    spending.reason = this.createSpendingForm.get('reason')?.value;
    spending.shared_with = sharedWith;
    spending.idx = maxIndex;

    console.log(spending);

    this.dataStorageService.addSpending(spending);

    this.createForm();
    this.mainPage.onSubmitForCalculation();

  }

  createForm() {
    this.createSpendingForm = this.formBuilder.group({
      participants: this.formBuilder.group({}),
      reason: 'Carrots and grapes'
    })
  }

  checkForAmountError():string {
    if (this.amountControl.hasError('required')) {
      return 'You must enter an amount';
    }
    if (this.amountControl.hasError('min')) {
      return 'An amount should be at least 1';
    }
    return '';
  }

  checkForPayerError():string {
    if (this.payerControl.hasError('required')) {
      return 'You must select a payer';
    }
    return '';
  }

  sharedWithPrintList(sharedWith: string[]): string {
    if (sharedWith.length === this.trip.participant_list.length) {
      return 'All';
    }
    let str;
    if (sharedWith.length > this.trip.participant_list.length / 2) {
      str = 'Not for: ';
      let first = true;
      for (const participant of this.trip.participant_list) {
        if (sharedWith.indexOf(participant.name) === -1) {
          if (!first) {
            str += ', ';
          }
          str += participant.name;
          first = false;
        }
      }
    } else {
      str = 'For: ';
      for (let i = 0; i < sharedWith.length; i++) {
        str += sharedWith[i];
        if (i !== sharedWith.length - 1) {
          str += ', ';
        }
      }
    }
    return str;
  }

  openSpendingModifDialog(spendingIdx: number): void {
    let spending = this.trip.spending_list.find(s => s.idx === spendingIdx);
    let dialogRef = this.dialog.open(DialogModifySpending, {data: {spending: spending, trip: this.trip}});
    dialogRef.afterClosed().subscribe(r => {this.mainPage.onSubmitForCalculation()})
  }

  ngOnInit(): void {
  }
}

@Component({
  selector: 'dialog-modify-spending',
  templateUrl: './dialog-modify-spending.html'
})
export class DialogModifySpending {

  public participantGroup: FormGroup;

  public modifiedAmountControl: FormControl;
  public modifiedPayerControl: FormControl;
  public modifiedReasonControl: FormControl;
  public participantSelectOptions: FormOption[] = [];
  public spending: SpendingService;
  public trip: TripService;

  constructor(
    public dialogRef: MatDialogRef<DialogModifySpending>,
    public dataStorageService: DataStorageService,
    public formBuilder : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.spending = data.spending;
    this.trip = data.trip;
    this.participantGroup = formBuilder.group({});
    this.trip.participant_list.forEach((p: PersonService) => {
      this.participantGroup.addControl(p.name, new FormControl(this.spending.shared_with.indexOf(p.name) !== -1))
    });
    this.participantGroup.addControl('All', new FormControl(this.spending.shared_with.length === this.trip.participant_list.length));
    this.modifiedAmountControl = new FormControl('', [Validators.required]);
    this.modifiedAmountControl.setValue(this.spending.amount);
    this.modifiedPayerControl = new FormControl('', [Validators.required]);
    this.modifiedPayerControl.setValue(this.spending.payed_by);
    this.modifiedReasonControl = new FormControl('');
    this.modifiedReasonControl.setValue(this.spending.reason);
    this.refreshSelect();
  }

  refreshSelect() {
    this.participantSelectOptions = []
    for (const participant of this.trip.participant_list) {
      this.participantSelectOptions.push({value: participant.name, viewValue:participant.name})
    }
  }

  updateSpending(): void {
    this.spending.amount = this.modifiedAmountControl.value;
    this.spending.payed_by = this.modifiedPayerControl.value;
    this.spending.reason = this.modifiedReasonControl.value;
    this.spending.shared_with = [];
    let sharedToAll = this.participantGroup.get('All')?.value;
    for (let p of this.trip.participant_list) {
      let shared = this.participantGroup.get(p.name);
      if (sharedToAll || shared?.value) {
        this.spending.shared_with.push(p.name);
      }
      console.log("Participant " + p.name + (shared?.value ? " do " : " doesn't ") + "share this spending");
    }
    this.dialogRef.close();
  }

  deleteSpending(): void {
    this.dataStorageService.removeSpending(this.spending.idx);
    this.dialogRef.close();
  }


}
