declare module 'express-promise-router' {
    import {Router as ExpressRouter, RouterOptions} from 'express'

    function Router(options?: RouterOptions): ExpressRouter

    export default Router
}
