import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../models/food.interface';

@Injectable({
  providedIn: 'root'
})
export class FoodBankService {
  private readonly STORAGE_KEY = 'food-bank';
  private foodsSubject = new BehaviorSubject<Food[]>([]);
  foods$ = this.foodsSubject.asObservable();

  constructor() {
    this.loadFoods();
  }

  public loadFoods(): void {
    const storedFoods = localStorage.getItem(this.STORAGE_KEY);
    if (storedFoods) {
      this.foodsSubject.next(JSON.parse(storedFoods));
    }
  }

  public saveFoods(foods: Food[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(foods));
    this.foodsSubject.next(foods);
  }
  
  getFoods(): Food[] {
    return this.foodsSubject.getValue();
  }
} 