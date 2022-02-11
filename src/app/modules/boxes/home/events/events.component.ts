import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name_event', 'cupo', 'availability'];
  @Input() dataSource = [];
  constructor() {}

  ngOnInit(): void {}
}
