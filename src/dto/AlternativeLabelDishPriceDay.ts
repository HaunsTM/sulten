import { AlternativeIndex } from "../server/enum/AlternativeIndex";
export class AlternativeLabelDishPriceDay {

    public alternativeIndex: AlternativeIndex;
    public labelName: string;
    public dishDescription: string;
    public dayIndex: number;
    public priceSEK: number;

    constructor(
        alternativeIndex: AlternativeIndex,
        labelName: string,
        dishDescription: string,
        dayIndex: number,
        pricesSEK: number) {

            this.alternativeIndex = alternativeIndex;
            this.labelName = labelName;
            this.dishDescription = dishDescription;
            this.dayIndex = dayIndex;
            this.priceSEK = pricesSEK;
    }
}
