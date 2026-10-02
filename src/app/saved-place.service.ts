import { Injectable } from '@angular/core';

export interface SavedPlace {
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  savedAt: string;
}

@Injectable({ providedIn: 'root' })
export class SavedPlaceService {
  private readonly storageKey = 'geo-memory-saved-places';

  getPlaces(): SavedPlace[] {
    const storedPlaces = localStorage.getItem(this.storageKey);

    if (!storedPlaces) {
      return [];
    }

    try {
      return JSON.parse(storedPlaces) as SavedPlace[];
    } catch {
      return [];
    }
  }

  savePlace(place: Omit<SavedPlace, 'savedAt'>): void {
    const places = this.getPlaces();
    const alreadySaved = places.some(
      (savedPlace) =>
        savedPlace.latitude === place.latitude &&
        savedPlace.longitude === place.longitude,
    );

    if (!alreadySaved) {
      places.unshift({ ...place, savedAt: new Date().toISOString() });
      localStorage.setItem(this.storageKey, JSON.stringify(places));
    }
  }

  deletePlace(place: SavedPlace): void {
    const places = this.getPlaces().filter(
      (savedPlace) => savedPlace.savedAt !== place.savedAt,
    );
    localStorage.setItem(this.storageKey, JSON.stringify(places));
  }
}
