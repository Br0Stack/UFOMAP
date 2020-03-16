import { Component } from '@angular/core';
import {
  TopoServiceService
} from './topo-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent {
  title = 'JobsMap';

  constructor(private sy: TopoServiceService) {
  }
  getLocation(zip) {
    this.sy.getLocations(zip);
  }
}
