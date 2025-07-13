import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-test-component',
  imports: [RouterLink],
  templateUrl: './test-component.html',
  styleUrl: './test-component.css'
})
export class TestComponent {

}
