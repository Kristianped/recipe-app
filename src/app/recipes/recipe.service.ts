import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';

import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor( private store: Store<fromShoppingList.AppState>) {
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe): number {
    this.recipes.push(recipe);
    this.recipeListChanged();

    return this.recipes.length;
  }

  updateRecipe(index: number, recipe: Recipe): void {
    this.recipes[index] = recipe;
    this.recipeListChanged();
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipeListChanged();
  }

  private recipeListChanged(): void {
    this.recipesChanged.next(this.getRecipes());
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipeListChanged();
  }
}
