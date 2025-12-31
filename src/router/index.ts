import { createBrowserRouter } from "react-router";
import routes from './routes';
import React from "react";

const router = createBrowserRouter(routes.map(route => ({
    ...route,
    element: React.createElement(route.element)
})));
export default router;