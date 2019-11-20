export class LabelDishPriceDay {

    public LabelName: string;
    public DishDescription: string;
    public JavaScriptDayIndex: number;
    public PriceSEK: number;

    constructor(
        labelName: string,
        dishDescription: string,
        javaScriptDayIndex: number,
        pricesSEK: number) {

            this.LabelName = labelName;
            this.DishDescription = dishDescription;
            this.JavaScriptDayIndex = javaScriptDayIndex;
            this.PriceSEK = pricesSEK;
    }
}
