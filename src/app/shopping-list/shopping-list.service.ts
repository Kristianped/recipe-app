import {Injectable, EventEmitter} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';

@Injectable({providedIn: 'root'})
export class ShoppingListService {

  ingredientsChanged = new EventEmitter<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Bread', 2),
    new Ingredient('Apples', 5),
    new Ingredient('Cola', 3)
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  private ingredientListChanged(): void {
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
    this.ingredientListChanged();
  }

  addIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.ingredientListChanged();
  }
}