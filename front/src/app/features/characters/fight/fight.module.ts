import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FighterModule } from 'src/app/shared/components/fighter/fighter.module';
import { TitleBarModule } from 'src/app/shared/components/title-bar/title-bar.module';
import { FightComponent } from './fight.component';

@NgModule({
  declarations: [
    FightComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,

    FighterModule,
    TitleBarModule,
  ]
})
export class FightModule { }
