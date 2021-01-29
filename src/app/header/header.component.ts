import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed: boolean = true;

  @Output() selectEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(selected: string): void {
    this.selectEvent.emit(selected);
  }
}
