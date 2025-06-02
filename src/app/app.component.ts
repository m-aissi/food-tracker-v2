import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Food } from './models/food.interface';
import { FoodBankService } from './services/food-bank.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Input } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(
    private foodBankService: FoodBankService,
    private http: HttpClient
  ) {

  }

  foods: any[] = [];
  charts: { [key: string]: Chart } = {};
  nameExists = false;
  foodName: any;
  foodCalories: any;
  caloriesEmpty = true;
  foodIsEmpty = true;
  nameError : String = '';
  calorieError : String = '';
  foodProtein : any;
  foodCarbs : any;
  foodFat : any;
  foodFiber : any;

  ngOnInit(): void {
    this.http.get<Food[]>('http://192.168.1.90:3000/api/foods')
      .subscribe({
        next: (foods) => {
          this.foods = foods;
        }
      });  }

  initFoods() {
    this.http.get<Food[]>('http://192.168.1.90:3000/api/foods')
      .subscribe({
        next: (foods) => {
          this.foods = foods;
        }
      });
  }

  ngAfterViewInit() {
    // Attendre un peu que le DOM soit complètement chargé
    setTimeout(() => {
      this.foods.forEach(food => {
        this.createDoughnut(food, 'chart-' + food.id);
      });
    }, 0);
  }


  createDoughnut(food: any, canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Détruire le graphique existant s'il y en a un
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
    }

    // Créer les données pour le doughnut
    const data = {
      labels: ['Protein', 'Carbs', 'Fat', 'Fiber'],
      datasets: [{
        data: [
          food.protein || 0,
          food.carbs || 0,
          food.fat || 0,
          food.fiber || 0
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };

    // Créer le doughnut
    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        layout: {
          padding: 0
        }
      }
    });
  }

  addFood() {
    const foodName = document.getElementById('foodName') as HTMLInputElement;
    const calories = document.getElementById('calories') as HTMLInputElement;
    const protein = document.getElementById('protein') as HTMLInputElement;
    const carbs = document.getElementById('carbs') as HTMLInputElement;
    const fat = document.getElementById('fat') as HTMLInputElement;
    const fiber = document.getElementById('fiber') as HTMLInputElement;

    const newFood: Food = { 
      name: foodName.value,
      calories: parseInt(calories.value),
      protein: parseInt(protein.value),
      carbs: parseInt(carbs.value),
      fat: parseInt(fat.value),
      fiber: parseInt(fiber.value)
    };
    if(this.foods.find(food => food.name === newFood.name)) {
      console.log('Food already exists');
      return;
    }
    this.foods.push(newFood);
    this.createDoughnut(newFood, 'chart-' + newFood.id);
    this.http.post('http://192.168.1.90:3000/api/foods', newFood)
      .subscribe({
        next: () => {
          console.log('Food added successfully');
        }
      });

    //on reset les inputs field
    this.foodCalories = '';
    this.foodName = '';
    this.foodProtein = '';
    this.foodCarbs = '';
    this.foodFat = '';
    this.foodFiber = '';

    this.areInputsValid();
  }

  deleteFood(name: string) {
    console.log(name);
    this.http.delete(`http://192.168.1.90:3000/api/foods/${name}`)
      .subscribe({
        next: () => {
          console.log('Food deleted ssssss');
        }
      });

    this.foods = this.foods.filter(food => food.name !== name);
  }

  isNameValid(){
    this.checkNameEmpty();
    this.checkNameExists();
  }

  isCaloriesValid(){
    this.checkCaloriesEmpty()
  }

  checkNameExists() {
    if (this.foods.find(food => food['name'].toLowerCase() === this.foodName.toLowerCase())){
      this.nameError = "This name is already taken";
    }
    else {
    }
  }

  checkNameEmpty(){
    console.log("pain")
    if(this.foodName){
      this.nameError = ""
    }
    else{
      this.nameError = "Name cannot be empty."
    }
  }

  checkCaloriesEmpty() {
    console.log(this.foodCalories);
    console.log("LIBEREZ BAKHAW PAR PITIE")
    if (!this.foodCalories) {
      this.calorieError = 'Calories cannot be empty';
      console.log("TRIPLE MONSTRE")
    } else {
      this.calorieError = '';
      console.log(":((((((((((((((")
    }
  }

  areInputsValid(){
    this.checkNameEmpty();
    this.isCaloriesValid();
  }

  isFormValid(){
    return this.calorieError.length === 0 && this.nameError.length === 0;
  }
}