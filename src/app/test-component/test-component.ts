import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-test-component',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './test-component.html',
  styleUrl: './test-component.css'
})
export class TestComponent {

}
