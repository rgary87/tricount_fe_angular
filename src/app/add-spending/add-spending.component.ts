import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {PersonService} from "../services/person.service";
import {SpendingService} from "../services/spending.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TripService} from "../services/trip.service";

interface FormOption {
  value: string;
  viewValue: string;
}

export interface DialogData {
  amount: number;
  payed_by: string;
  shared_with: [];
  idx: number;
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

  public spendingsColumns: string[] = ['amount', 'paid_by', 'for', 'remove'];
  private _participantSelectOptions: FormOption[] = [];
  public payer: string = '';
  public amount: number = 0;

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
    public appComponent: AppComponent,
    public dataStorageService: DataStorageService
  ) {
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      console.log("Trip refreshed in add-spending  with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_participants, value.number_of_refunds_on_participants);
      console.log("Number of spendings before : %o", this.trip.number_of_spendings);
      // this.trip = JSON.parse(JSON.stringify(value));
      this.trip = value;
      console.log("Number of spendings after : %o", this.trip.number_of_spendings);
      this.spending_list = this.trip.spending_list;
      this.participant_list = this.trip.participant_list;
      this.refreshSelect();
      this.refreshParticipants();
      this.updated = !this.updated;
      console.log("updated du cul: %o", this.updated);
    });
    console.log("updated value: %o", this.updated);
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

    let final_object_to_use_later_on_in_app = new SpendingService();
    final_object_to_use_later_on_in_app.amount = this.createSpendingForm.value['amount'];
    final_object_to_use_later_on_in_app.payed_by = this.payer;
    final_object_to_use_later_on_in_app.shared_with = sharedWith;
    final_object_to_use_later_on_in_app.idx = maxIndex;

    console.log(final_object_to_use_later_on_in_app);

    this.dataStorageService.addSpending(final_object_to_use_later_on_in_app);

    this.createForm();
    this.appComponent.onSubmitForCalculation();

  }

  createForm() {
    this.createSpendingForm = this.formBuilder.group({
      participants: this.formBuilder.group({}),
      amount: 0,
      reason: 'Carrots and grapes'
    })
  }

  ngOnInit(): void {
  }
}

@Component({
  selector: 'dialog-modify-spending',
  templateUrl: './dialog-modify-spending.html'
})
export class DialogModifySpending {
  constructor(
    public dialogRef: MatDialogRef<DialogModifySpending>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
