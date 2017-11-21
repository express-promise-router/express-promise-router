declare module 'express-promise-router' {
    import {Router, RouterOptions} from 'express'

    function Router(options?: RouterOptions): Router

    export = Router
}
