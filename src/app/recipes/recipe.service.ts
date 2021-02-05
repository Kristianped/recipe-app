import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {
  }

  private recipes: Recipe[] = [
    new Recipe(
      'Guacamole',
      'Holy Guacamoly',
      'https://pixnio.com/free-images/food-and-drink/guacamole-avocados.jpg',
      [
        new Ingredient('Avocado', 5),
        new Ingredient('Garlic', 1),
        new Ingredient('Lemon', 1)
      ]),
    new Recipe(
      'Taco',
      'Friday night Tacos',
      'https://oppskrift.dagbladet.no/bilder/c/xl/1/da3bc4f3-taco-med-ananassalsa.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Spices', 1),
        new Ingredient('Cucumber', 1),
        new Ingredient('Cheese', 1),
        new Ingredient('Lefser', 8),
        new Ingredient('Jalapenos', 10)
      ])
  ];

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
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
}
