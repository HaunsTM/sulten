import {AreaName} from "../../enum/AreaName";

export class Area {

    public id: number;

    public name: string;

    constructor(name: AreaName) {

        this.name = name;

    }

}
