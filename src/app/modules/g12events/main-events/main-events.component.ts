import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-events',
  templateUrl: './main-events.component.html',
  styleUrls: ['./main-events.component.scss']
})
export class MainEventsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  //NAVEGAMOS AL COMPONENTE DE CREAR EVENTO
  redirectToAdd() {
    this.router.navigate(['/g12events/add']);
  }

}
