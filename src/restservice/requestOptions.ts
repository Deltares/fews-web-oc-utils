export class RequestOptions {
    private _mode = "cors";
    private _relativeUrl = true;


    get relativeUrl(): boolean {
        return this._relativeUrl;
    }

    set relativeUrl(value) {
        this._relativeUrl = value;
    }

    get mode(): string {
        return this._mode;
    }

    set mode(value: string) {
        this._mode = value;
    }

}
