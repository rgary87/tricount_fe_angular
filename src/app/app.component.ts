import {Component, HostListener, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DataStorageService} from "./services/data-storage.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {DataAccessService} from "./services/data-access.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {

  mobile:boolean = false;

  constructor(
    private dataStorageService: DataStorageService,
    public dialog: MatDialog) {
  }

  reset(): void{
    this.dataStorageService.reset();
    location.reload();
  }

  print_data(): void {
    this.dataStorageService.print_data()
  }

  openShareDialog():void {
    this.dialog.open(DialogSharePage, {data: DataAccessService.UUID});
  }

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

@Component({
  selector: 'dialog-share-page',
  templateUrl: './dialog-share-page.html'
})
export class DialogSharePage {
  uuid: string;
  url: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.uuid = data;
    this.url = window.location.href;
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.url + this.uuid);
  }

}
