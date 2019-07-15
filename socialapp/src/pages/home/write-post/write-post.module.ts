import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WritePostPage } from './write-post';

@NgModule({
  declarations: [
    WritePostPage,
  ],
  imports: [
    IonicPageModule.forChild(WritePostPage),
  ],
})
export class WritePostPageModule {}
