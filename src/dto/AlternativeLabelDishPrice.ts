import { IndexNumber } from "../server/enum/IndexNumber";

export class AlternativeLabelDishPrice {

    public indexNumber: IndexNumber;
    public labelName: string;
    public dishDescription: string;
    public priceSEK: number;

    constructor(
        indexNumber: IndexNumber,
        labelName: string,
        dishDescription: string,
        pricesSEK: number) {

            this.indexNumber = indexNumber;
            this.labelName = labelName;
            this.dishDescription = dishDescription;
            this.priceSEK = pricesSEK;
    }
}
