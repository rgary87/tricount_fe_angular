import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'euro'
})
export class EuroPipe implements PipeTransform {
  transform(n: number, sign: boolean = false): any {
    return n.toFixed(2) + (sign ? " €" : "");
  }
}
