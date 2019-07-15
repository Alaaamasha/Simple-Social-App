import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendsRequestsPage } from './friends-requests';

@NgModule({
  declarations: [
    FriendsRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendsRequestsPage),
  ],
})
export class FriendsRequestsPageModule {}
