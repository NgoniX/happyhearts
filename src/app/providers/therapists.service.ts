import { OfflineManagerService } from './offline-manager.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage } from '@ionic/storage';
import { Observable, from, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { apiURL } from '../../environments/environment';

const API_STORAGE_KEY = 'specialkey';

// Typescript custom enum for search types (optional)
export enum SearchType {
  all = '',
  Counselors = 'Counselors',
  Psychologists = 'Psychologists',
  Therapists = 'Therapists'
}

@Injectable({
  providedIn: 'root'
})
export class TherapistsService {

  // get url of api for therapists
  url: string = apiURL.BASE_URL + 'therapists';

  // get url of single therapist
  url2: string = apiURL.BASE_URL + 'therapist-details';

  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService
  ) { }

  getTherapists(specParam, searchTerm, type: SearchType, forceRefresh: boolean = false): Observable<any> {

    let params = new HttpParams();

    params = params.append('specParam', specParam);
    params = params.append('categoryName', type);
    params = params.append('searchTerm', searchTerm);


    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getLocalData('therapists'));
    } else {

      // Return real API data and store it locally
      return this.http.get(this.url, { params }).pipe(
        map(this.extractData),
        tap(res => {
          this.setLocalData('therapists', res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getTherapistDetails(id): Observable<any> {

    let params = new HttpParams();

    params = params.append('id', id);


    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      // Return the cached data from Storage
      console.log('From storage');
      return from(this.getLocalData('therapistDetail'));
    } else {
      console.log('Not from storage');
      // Return real API data and store it locally
      return this.http.get(this.url2, { params }).pipe(
        map(this.extractData),
        tap(res => {
          this.setLocalData('therapistDetail', res);
        }),
        catchError(this.handleError)
      );
    }
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return throwError(errMsg);
  }

  // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
}
