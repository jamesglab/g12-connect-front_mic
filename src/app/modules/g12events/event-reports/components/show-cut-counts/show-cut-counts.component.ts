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
  public cuts_show = [];

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges() {
    this.cuts_show = [];
    if (this.cuts) {
      Object.keys(this.cuts).map(async (element) => {
        this.cuts_show.push(element);
      });
    }

  }

  sendtable(cut) {
    this.selected_cut = cut;
    this.send_data.emit(this.cuts[cut]);
  }

}
