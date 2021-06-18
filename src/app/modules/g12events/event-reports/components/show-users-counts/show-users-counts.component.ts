import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-users-counts',
  templateUrl: './show-users-counts.component.html',
  styleUrls: ['./show-users-counts.component.scss']
})
export class ShowUsersCountsComponent implements OnInit {
  @Input() info_users_count;
  constructor() { }

  ngOnInit(): void {
  }

}
