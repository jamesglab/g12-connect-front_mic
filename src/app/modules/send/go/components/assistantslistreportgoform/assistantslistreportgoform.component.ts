import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
// import { Subscription } from 'rxjs';

import { GoService } from '../../../_services/goservice.service';

// import { Response } from '../../../../auth/_models/auth.model';

@Component({
  selector: 'app-assistantslistreportgoform',
  templateUrl: './assistantslistreportgoform.component.html',
  styleUrls: ['./assistantslistreportgoform.component.scss']
})
export class AssistantslistreportgoformComponent implements OnInit {

  @Input() public goId: number;
  @Input() public assistants: any[] = [];
  @Output() public handleAssistants: EventEmitter<{}> = new EventEmitter();

  
  public isLoading$: boolean;
  // private unsubscribe: Subscription[] = [];

  constructor(private _goService: GoService, private _cdr: ChangeDetectorRef) { 
    this.isLoading$ = this._goService.isLoading$;
  }

  ngOnInit(): void {}

  ngOnChanges(){
    setTimeout(()=>{this._cdr.detectChanges();})
  }

  // getAssistants(){
  //   console.log("Pero que pasa", this.goId)
  //   const assistantsListSubscr = this._goService
  //     .getAssistantsList({ id: this.goId }).subscribe((res: Response) => {
  //       if (res.result) {
  //         this.assistants = res.entity;
  //         this._cdr.detectChanges();
  //       } else {
  //        //show notification 
  //       }
  //     });
  //   this.unsubscribe.push(assistantsListSubscr);
  // }

  handleTakeList(element, checked: boolean){
    const { idMember } = element; 
    this.handleAssistants.emit({ member: { idMember }, status: !checked });
  }
  
  // ngOnDestroy() {
  //   this.unsubscribe.forEach((sb) => sb.unsubscribe());
  // }

}
