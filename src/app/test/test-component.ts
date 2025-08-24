import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule  // Add RouterModule to imports
  ],
  templateUrl: './test-component.html',
  styleUrls: ['./test-component.css']
})
export class TestComponent {
  constructor(private router: Router) {}

  sendDataToHello() {
    const exampleData = {
      message: 'Hello from Test Component!',
      timestamp: new Date().toISOString()
    };

    this.router.navigate(['/hello'], {
      state: { data: exampleData }
    });
  }
}
