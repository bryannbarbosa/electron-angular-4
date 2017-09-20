import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  DDI:number;
  DDD:number;

  constructor(private electronServices: ElectronService) { }

  public analyse() {
    let ipcRenderer = this.electronServices.ipcRenderer;
    ipcRenderer.send('startProcess', 'hello');
  }

  

}
