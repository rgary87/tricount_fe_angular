import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {PersonService} from "../services/person.service";
import {AppComponent} from "../app.component";
import {DataStorageService} from "../services/data-storage.service";
import {AddSpendingComponent} from "../add-spending/add-spending.component";

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

  // items = this.cartService.getItems();

  constructor(
    private formBuilder: FormBuilder,
    private personService: PersonService,
    public appComponent: AppComponent,
    public dataStorageService: DataStorageService,
  ) {
  }

  addPersonForm = this.formBuilder.group({
    name: 'Poupi',
    payed_amount: 0,
    number_of_days: this.dataStorageService.getTrip().default_number_of_days,
    owe_amount: 0,
    refund_to: []
  });



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
}
