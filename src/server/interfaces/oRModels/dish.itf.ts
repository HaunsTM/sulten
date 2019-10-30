import { IEntity } from "./entity.itf";
import { ILabel } from "./label.itf";
import { IMeal } from "./meal.itf";

export interface IDish extends IEntity {

    id: number;

    description: string;

    price_SEK: string;

    // navigation properties
    label: ILabel;
    meals: IMeal[];

}
