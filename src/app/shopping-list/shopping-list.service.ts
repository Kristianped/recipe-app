import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Ingredient} from '../shared/ingredient.model';

@Injectable()
export class ShoppingListService {
  startedEditing = new Subject<number>();
  ingredientsChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Bread', 2),
    new Ingredient('Apples', 5),
    new Ingredient('Cola', 3)
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  private ingredientListChanged(): void {
    this.ingredientsChanged.next(this.getIngredients());
  }

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
    this.ingredientListChanged();
  }

  addIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.ingredientListChanged();
  }

  updateIngredient(index: number, newIngredient: Ingredient): void {
    this.ingredients[index] = newIngredient;
    this.ingredientListChanged();
  }

  deleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.ingredientListChanged();
  }
}
