import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable()
export class TitleService {

  constructor(private title: Title) { }

  setTitle() {
    this.title.setTitle('我是');
  }

  getTitle() {
    const title = this.title.getTitle();
    console.log(title);
  }
}
