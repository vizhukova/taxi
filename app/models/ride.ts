
export class Ride {
    public time: string;
    public from: Object;
    public to: Object;

    constructor(time: string, from: Object, to: Object) {
        this.time = time;
        this.from = from;
        this.to = to;
    }
}
