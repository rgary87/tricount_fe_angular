import {Component, Inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {PersonService} from "../services/person.service";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {TripService} from "../services/trip.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogModifySpending} from "../add-spending/add-spending.component";
import {AddRefundComponent} from "../add-refund/add-refund.component";
import {MainPageComponent} from "../main-page/main-page.component";


interface DialogData {
  participant: PersonService,
  trip: TripService
}


@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

  public participantsColumns: string[];
  public participantRefundsColumns: string[] = [];

  public trip: TripService = new TripService();
  public addPersonForm: FormGroup = this.formBuilder.group({});
  public nameControl: FormControl;
  public dayCountControl: FormControl = new FormControl();

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public mainPage: MainPageComponent,
    public dataStorageService: DataStorageService,
    public refundComponent: AddRefundComponent
  ) {
    this.nameControl = new FormControl('', [Validators.required, Validators.maxLength(255)])
    this.nameControl.setValue('Poupi');
    this.participantsColumns = ['name', 'stayed', 'owe', 'payed', 'spent'];
    this.dataStorageService.tripBehaviorSubject.subscribe(value => {
      console.log("Trip refreshed in add-person    with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_refunds, value.number_of_refunds_on_participants);
      this.trip = value;
      this.createParticipantForm();
      this.dayCountControl = new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.trip.default_number_of_days)])
      this.dayCountControl.setValue(this.trip.default_number_of_days);
    });
  }

  createParticipantForm(): void {
    this.addPersonForm = this.formBuilder.group({
      name: 'Poupi',
      number_of_days: this.trip.default_number_of_days,
    });
    this.participantsColumns = ['name', 'stayed', 'owe', 'payed', 'spent'];
    for (const participant of this.trip.participant_list) {
      if (participant.refund_to.length > 0) {
        this.participantsColumns.splice(5, 0, 'refunds');
        break;
      }
    }
    this.participantRefundsColumns = ['amount', 'refunds_to'];
  }


  ngOnInit(): void {
  }

  checkParticipantNameError(): string {
    if (this.nameControl.hasError('required')) {
      return 'You must set a name';
    }
    if (this.nameControl.hasError('maxlength')) {
      return 'A name must have less than 255 characters';
    }
    if (this.nameControl.hasError('Hitler')) {
      return 'José ? José c\'est toi ?';
    }
    return '';
  }

  checkParticipantDayCountError(): string {
    if (this.dayCountControl.hasError('required')) {
      return 'You must enter a number of days/meals/other';
    }
    if (this.dayCountControl.hasError('Duplication')) {
      return 'Names must be unique';
    }
    if (this.dayCountControl.hasError('min') || this.dayCountControl.hasError('max')) {
      return 'The number of days/meals/other must be between 1 and ' + this.trip.default_number_of_days + ' (default trip time)';
    }
    return '';
  }

  onSubmit(): void {
    console.log("nameControl.invalid: %o", this.nameControl.invalid);
    console.log("nameControl: %o", this.nameControl);
    console.log("nameControl.value: %o", this.nameControl.value);
    console.log("dayCountControl.invalid: %o", this.dayCountControl.invalid);
    console.log("dayCountControl: %o", this.dayCountControl);
    console.log("dayCountControl.value: %o", this.dayCountControl.value);
    if (this.trip.participant_list.map(p => p.name).includes(this.nameControl.value)) {
      this.nameControl.setErrors({'Duplication': true});
      return;
    }
    if (this.nameControl.value.toUpperCase() === 'HITLER') {
      this.nameControl.setErrors({'Hitler': true});
      return;
    }
    if (this.dayCountControl.invalid || this.nameControl.invalid) {
      return;
    }
    // Process checkout data here
    this.mainPage.display_base_page = false;
    let person = new PersonService();
    person.name = this.nameControl.value;
    person.day_count = this.dayCountControl.value;
    this.dataStorageService.addParticipant(person);
    this.mainPage.onSubmitForCalculation();
  }

  openParticipantModifDialog(participantName: string): void {
    let participant = this.trip.participant_list.find(p => p.name === participantName);
    let dialogRef = this.dialog.open(DialogModifyPerson, {data: {participant: participant, trip: this.trip}});
    dialogRef.afterClosed().subscribe(r => {
      this.mainPage.onSubmitForCalculation()
    })
  }

  public getTotalCost(): number {
    return this.trip.participant_list.map(p => p.payed_amount).reduce((acc, value) => acc + value, 0);
  }
}


@Component({
  selector: 'dialog-modify-person',
  templateUrl: './dialog-modify-person.html'
})
export class DialogModifyPerson {

  public modifiedNameControl: FormControl;
  public modifiedDayCountControl: FormControl;

  public participant: PersonService;
  public trip: TripService;

  constructor(
    public dialogRef: MatDialogRef<DialogModifyPerson>,
    public dataStorageService: DataStorageService,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.participant = data.participant;
    this.trip = data.trip;
    this.modifiedNameControl = new FormControl('', [Validators.required]);
    this.modifiedNameControl.setValue(this.participant.name);
    this.modifiedDayCountControl = new FormControl('', [Validators.required]);
    this.modifiedDayCountControl.setValue(this.participant.day_count);
  }

  updateParticipant(): void {
    let originalName = this.participant.name;
    let updatedName = this.modifiedNameControl.value;
    this.participant.name = this.modifiedNameControl.value;
    this.participant.day_count = this.modifiedDayCountControl.value;
    for (const s of this.trip.spending_list) {
      if (s.payed_by === originalName) {
        s.payed_by = updatedName;
      }
      let idx = s.shared_with.indexOf(originalName);
      if (idx !== -1) {
        s.shared_with.splice(idx, 1);
        s.shared_with.push(updatedName)
      }
    }
    for (const p of this.trip.participant_list) {
      for (const r of p.refund_to) {
        if (r.from === originalName) {
          r.from = updatedName;
        }
        if (r.to === originalName) {
          r.to = updatedName;
        }
      }
    }

    this.dialogRef.close();
  }


  deleteParticipant(): void {
    this.dataStorageService.removeParticipant(this.participant.name);
    this.dialogRef.close();
  }
}



