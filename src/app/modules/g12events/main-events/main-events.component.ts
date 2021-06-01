import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { G12eventsService } from '../_services/g12events.service';

@Component({
  selector: 'app-main-events',
  templateUrl: './main-events.component.html',
  styleUrls: ['./main-events.component.scss']
})
export class MainEventsComponent implements OnInit {

  constructor(private eventsService: G12eventsService, private router: Router) { }

  ngOnInit(): void {}

  redirectToAdd() {
    console.log("REDIRECT TO ADD");
    this.router.navigate(['/g12events/add']);
  }

}
