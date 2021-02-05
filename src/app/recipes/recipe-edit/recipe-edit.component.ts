import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from '../recipe.service';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeForm: FormGroup;

  id: number;
  editMode = false;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;

      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          const ingredientGroup = new FormGroup({
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          });
          recipeIngredients.push(ingredientGroup);
        }
      }
    }

    const name = new FormControl(recipeName, Validators.required);
    const imagePath = new FormControl(recipeImagePath, Validators.required);
    const description = new FormControl(recipeDescription, Validators.required);

    this.recipeForm = new FormGroup({
      name, imagePath, description, ingredients: recipeIngredients
    });
  }

  onSubmit(): void {
    const name = this.recipeForm.value.name;
    const imagePath = this.recipeForm.value.imagePath;
    const description = this.recipeForm.value.description;
    const ingredients = this.recipeForm.value.ingredients;

    const newRecipe = new Recipe(name, description, imagePath, ingredients);

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
      this.onCancel();
    } else {
      const newIndex = this.recipeService.addRecipe(newRecipe) - 1;
      this.router.navigate(['../', newIndex], {relativeTo: this.route});
    }
  }

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  get controls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onAddIngredient(): void {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onDeleteIngredient(index: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }
}
