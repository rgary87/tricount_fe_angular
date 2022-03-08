import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {PersonService} from "../services/person.service";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {TripService} from "../services/trip.service";

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

  public participantsColumns: string[] = ['name', 'stayed', 'remove'];
  public participantRefundsColumns: string[] = [];

  public trip: TripService = new TripService();
  public addPersonForm: FormGroup = this.formBuilder.group({});

  constructor(
    private formBuilder: FormBuilder,
    public appComponent: AppComponent,
    public dataStorageService: DataStorageService,
  ) {
    this.participantsColumns = ['name', 'stayed', 'remove'];
    this.dataStorageService.tripBehaviorSubject.subscribe( value => {
      console.log("Trip refreshed in add-person    with %o spendings, %o participants, %o refunds, %o refunds on participants", value.number_of_spendings, value.number_of_participants, value.number_of_participants, value.number_of_refunds_on_participants);
      this.trip = value;
      this.createParticipantForm();
    });
  }

  createParticipantForm(): void {
    this.addPersonForm = this.formBuilder.group({
      name: 'Poupi',
      payed_amount: 0,
      number_of_days: this.trip.default_number_of_days,
      owe_amount: 0,
      refund_to: []
    });
    this.participantsColumns = ['name', 'stayed', 'remove'];
    for (const participant of this.trip.participant_list) {
      if (participant.refund_to.length > 0) {
        this.participantsColumns.splice(2, 0, 'refunds');
        break;
      }
    }
    this.participantRefundsColumns = ['amount', 'refunds_to'];
  }




  ngOnInit(): void {
  }

  onSubmit(): void {
    // Process checkout data here
    this.appComponent.display_base_page = false;
    let person = new PersonService();
    person.name = this.addPersonForm.value['name'];
    person.payed_amount = this.addPersonForm.value['payed_amount'];
    person.total_spent = person.payed_amount;
    person.day_count = this.addPersonForm.value['number_of_days'];
    this.dataStorageService.addParticipant(person);
    this.appComponent.onSubmitForCalculation();
    // this.addPersonForm.reset();

  }

  removeUser(name: string) {
    this.dataStorageService.removeParticipant(name);
    this.appComponent.onSubmitForCalculation();
  }
}
