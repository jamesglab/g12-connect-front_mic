import { Component, OnInit } from '@angular/core';
import { G12eventsService } from '../_services/g12events.service';

@Component({
  selector: 'app-main-events',
  templateUrl: './main-events.component.html',
  styleUrls: ['./main-events.component.scss']
})
export class MainEventsComponent implements OnInit {

  constructor(private eventsService: G12eventsService) { }

  ngOnInit(): void {}

}
