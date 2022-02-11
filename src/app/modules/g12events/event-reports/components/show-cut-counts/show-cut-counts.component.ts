import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-show-cut-counts',
  templateUrl: './show-cut-counts.component.html',
  styleUrls: ['./show-cut-counts.component.scss']
})
export class ShowCutCountsComponent implements OnInit {

  @Input() cuts: any;
  @Output() send_data = new EventEmitter<any>();
  public selected_cut: any;

  constructor() { }
  ngOnInit(): void {
    this.sendtable(this.cuts[0])
  }

  sendtable(cut) {
    this.selected_cut = cut;
    this.send_data.emit(cut);
  }

}
