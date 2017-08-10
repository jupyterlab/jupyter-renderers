declare module 'vega-embed' {
    type spec = String|Object;
    type Options = Object;
    interface Result {
        spec: Object;
        view: Object;
    }
    function embed(el: any, spec: any, opt?: any): Promise<Result>;
    export = embed;
}
