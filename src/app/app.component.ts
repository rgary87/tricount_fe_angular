import {Component, HostListener, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TripService, TripToJSON} from "./services/trip.service";
import {DataStorageService} from "./services/data-storage.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import { fromEvent, Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {

  mobile:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.mobile = event.target.innerWidth < 500;
  }

  isMobile(): void {
    this.mobile = window.innerWidth < 500;
  }

  ngOnInit(): void {
    this.isMobile();
    console.log("initialized...");
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log("change happened...");
  }


}
