import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomePage } from "./home.page";

const routes: Routes = [
  {
    path: "home",
    component: HomePage,
    children: [
      {
        path: "user-info",
        loadChildren: () =>
          import("../pages/user-info/user-info.module").then(
            (m) => m.UserInfoPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
