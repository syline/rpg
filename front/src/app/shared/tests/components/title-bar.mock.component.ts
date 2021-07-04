import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-bar',
  template: '',
})
export class TitleBarMockComponent {
  @Input() title: string;
}
