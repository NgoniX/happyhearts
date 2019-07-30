import { NetworkService, ConnectionStatus } from './providers/network.service';
import { OfflineManagerService } from './providers/offline-manager.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Contact Us',
      url: '/home',
      icon: 'contact'
    },
    {
      title: 'About Us',
      url: '/home',
      icon: 'information-circle-outline'
    },
    {
      title: 'Login',
      url: '/home',
      icon: 'log-in'
    },
    {
      title: 'Sign Up',
      url: '/home',
      icon: 'person-add'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status === ConnectionStatus.Online) {
          this.offlineManager.checkForEvents().subscribe();
        }
      });

    });
  }
}
