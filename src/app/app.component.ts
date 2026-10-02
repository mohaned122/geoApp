import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  protected readonly appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Saved places', url: '/saved-places', icon: 'bookmark' },
  ];
  constructor() {}
}
