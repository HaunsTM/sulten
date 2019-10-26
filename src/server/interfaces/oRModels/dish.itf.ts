import { IEntity } from "./entity.itf";
import { IMeal } from "./meal.itf";

export interface IDish extends IEntity {

    id: number;

    description: string;

    // navigation properties
    meals: IMeal[];

}
