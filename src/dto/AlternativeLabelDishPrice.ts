import { AlternativeIndex } from "../server/enum/AlternativeIndex";

export class AlternativeLabelDishPrice {

    public alternativeIndex: AlternativeIndex;
    public labelName: string;
    public dishDescription: string;
    public priceSEK: number;

    constructor(
        alternativeIndex: AlternativeIndex,
        labelName: string,
        dishDescription: string,
        pricesSEK: number) {

            this.alternativeIndex = alternativeIndex;
            this.labelName = labelName;
            this.dishDescription = dishDescription;
            this.priceSEK = pricesSEK;
    }
}
