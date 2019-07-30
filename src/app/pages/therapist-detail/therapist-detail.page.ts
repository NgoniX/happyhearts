import { LoadingController } from '@ionic/angular';
import { TherapistsService } from './../../providers/therapists.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apiURL } from '../../../environments/environment';

@Component({
  selector: 'app-therapist-detail',
  templateUrl: './therapist-detail.page.html',
  styleUrls: ['./therapist-detail.page.scss'],
})
export class TherapistDetailPage implements OnInit {

  therapist = [];
  isLoading = false;
  imgUrl: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private therapistService: TherapistsService,
    private loading: LoadingController
  ) { }

  ngOnInit() {
    // get url of photos
    this.imgUrl = `${apiURL.IMG_URL}`;

    // Get the ID that was passed with the URL
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadData(id);
    console.log('The id is ' + id);
  }

  loadData(id, refresher?) {
    this.present();
    // get details information
    this.therapistService.getTherapistDetails(id).subscribe(res => {
      this.therapist = res;

      console.log(res);

      if (refresher) {
        refresher.target.complete();
      }
      this.dismiss();
    });
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

}
