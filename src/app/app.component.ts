import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'virtual-scroll-app';
  activeView = "table"

  activeViewToggle(type:string){
    this.activeView = type
}

}
