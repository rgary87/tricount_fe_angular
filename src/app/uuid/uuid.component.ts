import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataAccessService} from "../services/data-access.service";

@Component({
  selector: 'app-uuid',
  templateUrl: './uuid.component.html',
  styleUrls: ['./uuid.component.css']
})
export class UuidComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private access: DataAccessService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log("Query Params: %o", params);
    });
    this.route.paramMap.subscribe(paramMap => {
      console.log("Map Params: %o", paramMap);
    })
    this.route.params.subscribe(params => {
      console.log("Params: %o", params);
    });
    this.route.data.subscribe(d => {
      console.log("d: %o", d);
    })
    const uuid = String(this.route.snapshot.paramMap.get('uuid'));
    console.log("Snapshot: %o", uuid);
    DataAccessService.UUID = uuid;
    this.access.retrieveTripFromServer();
    this.router.navigate(['']);
  }

}
