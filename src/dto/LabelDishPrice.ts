export class LabelDishPrice {

    public labelName: string;
    public dishDescription: string;
    public priceSEK: number;

    constructor(
        labelName: string,
        dishDescription: string,
        pricesSEK: number) {

            this.labelName = labelName;
            this.dishDescription = dishDescription;
            this.priceSEK = pricesSEK;
    }
}
