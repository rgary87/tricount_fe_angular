import { Injectable } from '@angular/core';
import { PersonService } from "./person.service";
import {SpendingService} from "./spending.service";
import {RefundService} from "./refund.service";
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  constructor() {
    this.uuid = uuidv4();
  }

  get total_amount(): number {
    this._total_amount = 0;
    for (let p of this.participant_list) {
      this._total_amount += p.total_spent;
    }
    return this._total_amount;
  }

  uuid: string = '';
  default_number_of_days: number = 0;
  private _total_amount: number = 0;
  spending_list: SpendingService[] = [];
  refund_list: RefundService[] = [];
  participant_list: PersonService[] = [];
  isInit: boolean = false;
  number_of_spendings: number = 0;
  number_of_refunds: number = 0;
  number_of_participants: number = 0;
  number_of_refunds_on_participants: number = 0;

}

export function TripToJSON(trip: TripService):string {
  Object.defineProperty(trip, '_total_amount', {enumerable: false});
  Object.defineProperty(trip, '_id', {enumerable: false});
  console.log("%o", trip);
  console.log(JSON.stringify(trip));
  return JSON.stringify(trip);
}
