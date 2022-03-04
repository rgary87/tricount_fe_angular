import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {PersonService} from "../services/person.service";
import {SpendingService} from "../services/spending.service";

@Component({
  selector: 'app-add-spending',
  templateUrl: './add-spending.component.html',
  styleUrls: ['./add-spending.component.css']
})
export class AddSpendingComponent implements OnInit {

  createSpendingForm: FormGroup;
  private _participantListForm: FormGroup;

  get participantListForm(): FormGroup {
    this.refreshParticipants();
    return this._participantListForm;
  }

  constructor (
    private formBuilder: FormBuilder,
    public appComponent: AppComponent,
    public dataStorageService: DataStorageService
  ) {
    this._participantListForm = formBuilder.group({});
    this.createSpendingForm = formBuilder.group({});
    this.createForm();
  }

  createForm(){
    this.createSpendingForm = this.formBuilder.group({
      payedBy: [null],
      participants: this.formBuilder.group({}),
      amount: 0,
      reason: 'Carrots and grapes'
    })
    this.refreshParticipants();
  }

  refreshParticipants():void {
    this._participantListForm = <FormGroup>this.createSpendingForm.get('participants');
    this.dataStorageService.getTrip().participant_list.forEach((p: PersonService) => {
      this._participantListForm.addControl(<string>p.name, new FormControl(true))
    });
  }

  onSubmit(): void {


    let group = <FormGroup>this.createSpendingForm.get('participants');

    let sharedWith = [];

    for (let p of this.dataStorageService.getTrip().participant_list) {
      let shared = group.get(p.name);
      if (shared?.value) {
        sharedWith.push(p.name);
      }
      console.log("Participant " + p.name + (shared?.value ? " do " : " doesn't ") + "share this spending");
      console.log(shared);
    }
    let maxIndex = 0;
    this.dataStorageService.getTrip().spending_list.forEach(s => {
      if (s.idx >= maxIndex) {
        maxIndex = s.idx + 1;
      }});

    let final_object_to_use_later_on_in_app = new SpendingService();
    final_object_to_use_later_on_in_app.amount = this.createSpendingForm.value['amount'];
    final_object_to_use_later_on_in_app.payed_by = this.createSpendingForm.value['payedBy'];
    final_object_to_use_later_on_in_app.shared_with = sharedWith;
    final_object_to_use_later_on_in_app.idx = maxIndex;

    console.log(final_object_to_use_later_on_in_app);

    this.dataStorageService.addSpending(final_object_to_use_later_on_in_app);

    this.createForm();
    this.appComponent.onSubmitForCalculation();
  }

  ngOnInit(): void {
  }

}
