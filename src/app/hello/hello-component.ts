import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hello-component.html',
  styleUrls: ['./hello-component.css']
})
export class HelloComponent implements OnInit {
  receivedData: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.receivedData = navigation?.extras?.state?.['data'];
  }

  ngOnInit() {
    if (!this.receivedData) {
      // Handle case when accessing page directly without data
      this.receivedData = {
        message: 'No data received',
        timestamp: new Date().toISOString()
      };
    } 
  }


}
