import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
  }

  get(key: string): any {
    let t = this.localStorage.getItem(key);
    if (t) {
      return JSON.parse(t);
    }
    return null;
  }

  set(key: string, value: any): void {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.localStorage.removeItem(key);
  }
}
