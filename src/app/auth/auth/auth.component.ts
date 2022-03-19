import { Component, OnInit } from '@angular/core';
import { AuthService, AuthToken } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
      private route : ActivatedRoute,
      private router : Router,
  ) {
      
  }

  ngOnInit(): void {
  }

}
