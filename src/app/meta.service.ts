import {Injectable} from '@angular/core';
import {Meta} from '@angular/platform-browser';


@Injectable()
export class MetaService {

  constructor(private meta: Meta) { }

  addTag() {
    this.meta.addTag({name: "keywords", content: "angular, typescript, rxjs"})
  }
  addTags() {
    this.meta.addTags([
      {name: "keywords", content: "angular, typescript, rxjs"},
      {name: 'description', content: 'Angular Meta Service'}
    ]);
  }

  getTag() {
    const tag = this.meta.getTag('name="viewport"');
    console.log(tag);
  }
  getTags() {
    const tag = this.meta.getTags('name');
    console.log(tag);
  }

  updateMetaTag() {
    this.meta.updateTag({name:"keywords", content: "12,23"})
  }

  removeTag() {
    this.meta.removeTag('name="keywords"');
  }

  removeElement() {
    const key = this.meta.getTag('name="description"');
    console.log(key);
    this.meta.removeTagElement(key);
  }

}
