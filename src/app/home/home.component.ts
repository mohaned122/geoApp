import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SavedPlaceService } from '../saved-place.service';

interface Place {
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly savedPlaceService = inject(SavedPlaceService);

  listA: Place[] = [
    {
      name: 'Eiffel Tower',
      latitude: 48.8584,
      longitude: 2.2945,
      altitude: 330,
    },
    {
      name: 'Mount Everest',
      latitude: 27.9881,
      longitude: 86.925,
      altitude: 8849,
    },
    {
      name: 'Statue of Liberty',
      latitude: 40.6892,
      longitude: -74.0445,
      altitude: 93,
    },
  ];
  latitude: number | null = null;
  longitude: number | null = null;
  altitude: number | null = null;
  compteurPositions: number = 0;
  debutSuivi: number = 0;
  watchId: number = -1;
  mypath: {
    latitude: number;
    longitude: number;
    altitude: number;
    timestamp: number;
  }[] = [];
  suiviActif = false;
  dureeSuivi = 0;

  enregistrerLieu(place: Place): void {
    this.savedPlaceService.savePlace(place);
    void this.router.navigate(['/saved-places']);
  }

  obtenirPositionPonctuelle(): void {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.altitude = position.coords.altitude ?? 0;

        this.listA.push({
          name: 'Ma position',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude ?? 0,
        });
      },
      (error: GeolocationPositionError) => {
        console.error('Erreur de géolocalisation :', error.message);
      },
      { enableHighAccuracy: true },
    );
  }

  demarrerSuivi(): void {
    if (!('geolocation' in navigator)) {
      alert("La géolocalisation n'est pas prise en charge par ce navigateur.");
      return;
    }

    if (this.suiviActif) {
      return;
    }

    this.compteurPositions = 0;
    this.debutSuivi = Date.now();
    this.dureeSuivi = 0;
    this.mypath = [];
    this.suiviActif = true;

    this.watchId = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        this.compteurPositions += 1;

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.altitude = position.coords.altitude ?? 0;

        this.dureeSuivi = Math.floor((Date.now() - this.debutSuivi) / 1000);
        this.mypath.push({
          latitude: this.latitude,
          longitude: this.longitude,
          altitude: this.altitude,
          timestamp: position.timestamp,
        });

        this.listA.push({
          name: 'Ma position',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude ?? 0,
        });
      },
      (error: GeolocationPositionError) => {
        console.error('Erreur de suivi de géolocalisation :', error.message);
        this.arreterSuivi();
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
    );
  }

  arreterSuivi(): void {
    if (this.watchId !== -1) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    this.watchId = -1;
    this.suiviActif = false;
    this.dureeSuivi = Math.floor((Date.now() - this.debutSuivi) / 1000);
  }
}
