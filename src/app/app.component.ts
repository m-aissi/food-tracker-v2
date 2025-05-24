import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Food } from './models/food.interface';
import { FoodBankService } from './services/food-bank.service';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private foodBankService: FoodBankService) {}
  foods: any[] = [];
  charts: { [key: string]: Chart } = {};

  ngOnInit(): void {
    const foodsItems = [
      { id: '1', name: 'Burger', calories: 500, carbs: 40, fat: 30 },
      { id: '2', name: 'MONSTRE', calories: 17, protein: 25, carbs: 40, fat: 30 },
      { id: '3', name: 'Apple', calories: 54, protein: 25, carbs: 40, fat: 30, fiber: 10 }
    ];
    console.log(foodsItems);
    this.foodBankService.saveFoods(foodsItems);
    this.foods = this.foodBankService.getFoods();
  }

  ngAfterViewInit() {
    // Attendre un peu que le DOM soit complètement chargé
    setTimeout(() => {
      this.foods.forEach(food => {
        this.createDoughnut(food, 'chart-' + food.id);
      });
    }, 0);
  }

  addFood(food: { id: string; name: string; calories: number; protein?: number; carbs?: number; fat?: number }): void {
    //this.foods.push(food);
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
}
