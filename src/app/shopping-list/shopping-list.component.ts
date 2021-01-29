import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [
    new Ingredient('Bread', 2),
    new Ingredient('Apples', 5),
    new Ingredient('Cola', 3)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onIngredientAdd(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

}
