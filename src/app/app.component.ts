import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputComponent } from './components/input/input.component';
import { Product } from './shared/models/product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
