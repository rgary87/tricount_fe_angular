import { Injectable } from '@angular/core';
import {RefundService} from "./refund.service";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  name: string = 'name';
  total_spent: number = 0;
  payed_amount: number = 0;
  day_count: number = 0;
  owe_amount: number = 0;
  refund_to: RefundService[] = [];
  constructor() {}

}
