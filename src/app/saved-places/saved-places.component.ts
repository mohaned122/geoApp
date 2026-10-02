import { Component, inject } from '@angular/core';
import { SavedPlace, SavedPlaceService } from '../saved-place.service';

@Component({
  selector: 'app-saved-places',
  templateUrl: './saved-places.component.html',
  styleUrls: ['./saved-places.component.scss'],
  standalone: false,
})
export class SavedPlacesComponent {
  private readonly savedPlaceService = inject(SavedPlaceService);
  places: SavedPlace[] = [];

  ionViewWillEnter(): void {
    this.places = this.savedPlaceService.getPlaces();
  }

  deletePlace(place: SavedPlace): void {
    this.savedPlaceService.deletePlace(place);
    this.places = this.savedPlaceService.getPlaces();
  }
}
