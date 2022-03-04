import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpendingService {

  public payed_by: string = '';
  public amount: number = 0;
  public shared_with: string[] = [];
  public reason: string = '';
  public idx: number = 0;

  constructor(){ }

}
