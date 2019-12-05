import {LabelName} from "../../enum/LabelName";

export class Label {

    public id: number;

    public name: string;

    constructor(name: LabelName) {
        this.name = name;
    }

}
