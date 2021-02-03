import {EventEmitter, Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  constructor(private shoppingListService: ShoppingListService) {
  }

  recipeSelected = new EventEmitter<Recipe>();

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
}
