import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [
    new Recipe('Guacamole', 'Holy Guacamoly', 'https://pixnio.com/free-images/food-and-drink/guacamole-avocados.jpg'),
    new Recipe('Taco', 'Friday night Tacos', 'https://oppskrift.dagbladet.no/bilder/c/xl/1/da3bc4f3-taco-med-ananassalsa.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
