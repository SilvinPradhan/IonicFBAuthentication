import { ApplicationRef, Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { interval } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  private readonly VALID_PUBLIC_KEY =
    "BGyqNYaBGEOTctaSwWl4Sn7-mJu01qcc_n4iAHAOlquVwfYISsed95Oosx43txhNwA-6kBx5BakGL5V0zKZuyZQ";

  promptEvent;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    private appRef: ApplicationRef,
    private swPush: SwPush
  ) {
    this.initializeApp();
    this.updateClient();
    //
    window.addEventListener("beforeinstallprompt", (event) => {
      this.promptEvent = event;
    });
  }

  // Push Notification
  ngOnInit() {
    this.pushSubscription();
    this.swPush.messages.subscribe((message) => console.log(message));
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      window.open(notification.data.url);
    });
  }

  // Get notified when a new version is available by using "available" Observable of SWUpdate,
  //  and then ask the user via a dialog if the user wants to get the new version.
  // update forcefully with page reload.
  updateClient() {
    if (!this.swUpdate.isEnabled) {
      console.log("Not Enabled");
      return;
    }
    this.swUpdate.available.subscribe((event) => {
      console.log(`current`, event.current, `available`, event.available);
      if (confirm("Update Available. Reload page?")) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    });
    this.swUpdate.activated.subscribe((event) => {
      console.log(`current`, event.previous, `available`, event.current);
    });
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      // Check is it is stable for 8 hours.
      if (isStable) { 
        const timeInterval = interval(8 * 60 * 60 * 1000);
        
        timeInterval.subscribe(() => {
          // If checked it will notifiy the activateUpdate()
          this.swUpdate.checkForUpdate().then(() => console.log("Checked!"));
          console.log("Update Checked");
        });
      }
    });
  }

  pushSubscription() {
    if (!this.swPush.isEnabled) {
      console.log("Notification is not enabled");
      return;
    }
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VALID_PUBLIC_KEY,
      })
      .then((sub) => console.log(JSON.stringify(sub)))
      .catch((err) => console.log(err));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
