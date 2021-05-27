import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { toInsertDate } from 'src/app/_helpers/tools/utils.tool';

@Component({
  selector: 'app-reports-filter',
  templateUrl: './reports-filter.component.html',
  styleUrls: ['./reports-filter.component.scss']
})
export class ReportsFilterComponent implements OnInit {

  public formFilter: FormGroup;
  public filterSelected: number = 3;
  //FOR MIN & MAX VALIDATION
  public minDateS: Date; //START AND END
  public maxDateS: Date;
  public minDateE: Date;
  public maxDateE: Date;

  @Output() public filtered: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) { 
    this.minDateS = new Date(new Date().getFullYear() - 1, 0, 1);
    this.maxDateS = new Date();
    this.minDateE = new Date(new Date().getFullYear(), 0, 1);
    this.maxDateE = new Date();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.formFilter = this.fb.group({
      StartDateWin: ['', Validators.required],
      EndDateWin: ['', Validators.required]
    })
  }

  get form() {
    return this.formFilter.controls;
  }

  onSubmit() {
    if (this.formFilter.invalid) {
      return;
    }
    const { StartDateWin, EndDateWin } = this.formFilter.getRawValue();

    this.filtered.emit({ 
      StartDateWin: toInsertDate(StartDateWin,'YYYY-MM-DD'),
      EndDateWin:  toInsertDate(EndDateWin, 'YYYY-MM-DD')
    });
  }

}
