import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefundService {

  constructor() { }

  from: string = '';
  to: string = '';
  amount: number = 0;
  done: boolean = false;
  idx: number = 0;

}
