// import React from 'react'
// import { Route, Redirect } from 'react-router-dom'

// function routerList({ routes, location }) {
//     console.log('routes, location', routes, location)
//     const { pathname } = location

//     const route404 = routes.find(v => v.path === '*') || {}
//     const currentRoute = routes.find(v => v.path === pathname) || route404
//     console.log('currentRoute', currentRoute, pathname)
//     return currentRoute.redirect ? (
//         <Redirect to={currentRoute.redirect} />
//     ) : (
//         <Route exact {...currentRoute} />
//     )
// }

// export default routerList
