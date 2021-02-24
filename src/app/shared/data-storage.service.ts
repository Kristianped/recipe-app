import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
  }

  putRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('https://recipe-book-f0344-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('https://recipe-book-f0344-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }), tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }));
  }
}