import { Component } from "@angular/core";

@Component({
  selector: "auth-message",
  template: `
    <div>
      保持登录 {{ days }} 天
    </div>
  `
})

export class AuthMessageComponent {
  days: number = 7;
}
