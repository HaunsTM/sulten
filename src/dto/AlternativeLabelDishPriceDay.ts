import { AlternativeIndex } from "../server/enum/AlternativeIndex";
export class AlternativeLabelDishPriceDay {

    public alternativeIndex: AlternativeIndex;
    public labelName: string;
    public dishDescription: string;
    public javaScriptDayIndex: number;
    public priceSEK: number;

    constructor(
        alternativeIndex: AlternativeIndex,
        labelName: string,
        dishDescription: string,
        javaScriptDayIndex: number,
        pricesSEK: number) {

            this.alternativeIndex = alternativeIndex;
            this.labelName = labelName;
            this.dishDescription = dishDescription;
            this.javaScriptDayIndex = javaScriptDayIndex;
            this.priceSEK = pricesSEK;
    }
}
