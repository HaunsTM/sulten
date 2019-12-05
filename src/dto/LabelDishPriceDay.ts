export class LabelDishPriceDay {

    public labelName: string;
    public dishDescription: string;
    public javaScriptDayIndex: number;
    public priceSEK: number;

    constructor(
        labelName: string,
        dishDescription: string,
        javaScriptDayIndex: number,
        pricesSEK: number) {

            this.labelName = labelName;
            this.dishDescription = dishDescription;
            this.javaScriptDayIndex = javaScriptDayIndex;
            this.priceSEK = pricesSEK;
    }
}
