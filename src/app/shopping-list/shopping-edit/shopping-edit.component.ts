import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  @ViewChild('nameInput', {static: false}) nameInputref: ElementRef;
  @ViewChild('amountInput', {static: false}) amountInputRef: ElementRef;
  @Output() ingredientAddedEvent = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit(): void {
  }

  onIngredientAdd(): void {
    this.ingredientAddedEvent.emit(new Ingredient(this.nameInputref.nativeElement.value, this.amountInputRef.nativeElement.value));
  }
}
