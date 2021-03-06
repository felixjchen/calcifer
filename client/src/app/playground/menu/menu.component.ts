import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuButton } from '../../interfaces/menu-button';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() menuButtons: MenuButton[] = [];
  @Input() activeButton: MenuButton;

  @Output() onMenuButtonClick = new EventEmitter<MenuButton>();
}
