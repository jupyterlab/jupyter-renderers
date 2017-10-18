declare module 'vega-embed' {
    type spec = String|Object;
    type Options = Object;
    interface Result {
        spec: Object;
        view: Object;
    }
    function embed(el: any, spec: any, opt?: any): Promise<Result>;
    // function embed(el: any, spec: any, opt: any, cb: (err: any, view: any) => void): void;
    export = embed;
}
