declare module "express-promise-router" {
  import { Router, RouterOptions } from "express";

  function PromiseRouter(options?: RouterOptions): Router;

  export default PromiseRouter;
}
