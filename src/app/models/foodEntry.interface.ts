import { Food } from './food.interface';

export enum MealType {
    Breakfast = 'breakfast',
    Lunch = 'lunch',
    Dinner = 'dinner',
    Snack = 'snack'
}

export interface FoodEntry {
    foodItem: Food;
    grams: number; 
    mealType?: MealType;
    timestamp: Date; 
}

export interface CustomFood {
    description: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    category?: string;
}

