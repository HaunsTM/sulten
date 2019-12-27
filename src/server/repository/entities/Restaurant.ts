export class Restaurant {

    public id: number;

    public active: boolean;

    public name: string;

    public menuUrl: string;

    public longitude: string;

    public latitude: string;

    constructor( id: number, active: boolean, name: string, menuUrl: string,
                 longitude: string, latitude: string ) {

        this.id = id;

        this.active = active;

        this.name = name;

        this.menuUrl = menuUrl;

        this.longitude = longitude;

        this.latitude = latitude;

    }

}
