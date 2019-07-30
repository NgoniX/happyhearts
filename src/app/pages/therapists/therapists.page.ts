import { TherapistsService, SearchType } from './../../providers/therapists.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { apiURL } from '../../../environments/environment';

@Component({
  selector: 'app-therapists',
  templateUrl: './therapists.page.html',
  styleUrls: ['./therapists.page.scss'],
})
export class TherapistsPage implements OnInit {

  speciality: string;
  isLoading = false;
  therapists = [];
  type: SearchType = SearchType.all;
  searchTerm = '';

  imgUrl: any;

  constructor(
    private route: ActivatedRoute,
    public loading: LoadingController,
    private alert: AlertController,
    private therapistService: TherapistsService
  ) { }

  ngOnInit() {

    // get url of photos
    this.imgUrl = `${apiURL.IMG_URL}`;

    // get speciality parameter from routeLink
    this.speciality = this.route.snapshot.paramMap.get('spec');

    this.loadData(this.speciality, this.searchTerm, this.type, true);

    console.log(this.imgUrl);

  }

  // when user chooses select option
  searchChanged() {
    this.loadData(this.speciality, this.searchTerm, this.type, true);
  }

  loadData(specParam, searchFilter, searchCat, refresh = false, refresher?) {
    this.present();
    // get url parameter for speciality
    this.therapistService.getTherapists(specParam, searchFilter, searchCat, refresh).subscribe(res => {
      this.therapists = res;

      if (res && res.length > 0) {
        console.log('Results Found');
      } else {
        // present alert
        this.presentAlert();
        console.log('Nothing');
      }

      if (refresher) {
        refresher.target.complete();
      }
      this.dismiss();
    });
  }

  // show alert message
  async presentAlert() {

    const alert = await this.alert.create({
      header: 'Info',
      message: 'No Results Found',
      buttons: ['OK']
    });
    return await alert.present();

  }

  // show loading icon
  async present() {
    this.isLoading = true;
    return await this.loading.create({
      duration: 9000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  // dismiss loading icon
  async dismiss() {
    this.isLoading = false;
    return await this.loading.dismiss().then(() => console.log('dismissed'));
  }

  doRefresh(event) {
    console.log('Begin async operation', event);
    this.speciality = this.route.snapshot.paramMap.get('spec');
    this.loadData(this.speciality, this.searchTerm, this.type, true);
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
