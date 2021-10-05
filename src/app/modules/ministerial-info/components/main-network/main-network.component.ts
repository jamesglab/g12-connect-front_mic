import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-network',
  templateUrl: './main-network.component.html',
  styleUrls: ['./main-network.component.scss']
})
export class MainNetworkComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'last_name', 'phone'];
  @Input() leaders;
  constructor() { }

  ngOnInit(): void {
  }

}
