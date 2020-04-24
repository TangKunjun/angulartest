import {Component, Inject, Input, OnInit} from '@angular/core';

@Component({
  selector: 'child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() data = {name: '我是子组件'};
  constructor() { }

  ngOnInit() {
  }

}
