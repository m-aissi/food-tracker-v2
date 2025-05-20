import { FoodEntry, CustomFood } from './foodEntry.interface';

export interface DailyEntry {
    id: string;
    date: Date;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    foodEntries?: FoodEntry[];
    customEntries?: CustomFood[];
}


