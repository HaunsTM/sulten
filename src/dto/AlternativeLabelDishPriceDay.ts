import { IndexNumber } from "../server/enum/IndexNumber";
export class AlternativeLabelDishPriceDay {

    public indexNumber: IndexNumber;
    public labelName: string;
    public dishDescription: string;
    public dayIndex: number;
    public priceSEK: number;

    constructor(
        indexNumber: IndexNumber,
        labelName: string,
        dishDescription: string,
        dayIndex: number,
        pricesSEK: number) {

            this.indexNumber = indexNumber;
            this.labelName = labelName;
            this.dishDescription = dishDescription;
            this.dayIndex = dayIndex;
            this.priceSEK = pricesSEK;
    }
}
