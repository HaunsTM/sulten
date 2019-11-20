export class LabelDishPrice {

    public LabelName: string;
    public DishDescription: string;
    public PriceSEK: number;

    constructor(
        labelName: string,
        dishDescription: string,
        pricesSEK: number) {

            this.LabelName = labelName;
            this.DishDescription = dishDescription;
            this.PriceSEK = pricesSEK;
    }
}
