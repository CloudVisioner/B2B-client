/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "__barrel_optimize__?names=CssBaseline!=!./node_modules/@mui/material/index.js":
/*!*************************************************************************************!*\
  !*** __barrel_optimize__?names=CssBaseline!=!./node_modules/@mui/material/index.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CssBaseline: () => (/* reexport safe */ _CssBaseline__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _CssBaseline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CssBaseline */ "./node_modules/@mui/material/node/CssBaseline/index.js");



/***/ }),

/***/ "./apollo/client.ts":
/*!**************************!*\
  !*** ./apollo/client.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeApollo: () => (/* binding */ initializeApollo),\n/* harmony export */   useApollo: () => (/* binding */ useApollo)\n/* harmony export */ });\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client/utilities */ \"@apollo/client/utilities\");\n/* harmony import */ var _apollo_client_utilities__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_utilities__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _apollo_client_link_subscriptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @apollo/client/link/subscriptions */ \"@apollo/client/link/subscriptions\");\n/* harmony import */ var _apollo_client_link_subscriptions__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_link_subscriptions__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var graphql_ws__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! graphql-ws */ \"graphql-ws\");\n/* harmony import */ var _apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @apollo/client/link/error */ \"@apollo/client/link/error\");\n/* harmony import */ var _apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apollo-upload-client */ \"apollo-upload-client\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ \"./apollo/utils.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([graphql_ws__WEBPACK_IMPORTED_MODULE_3__, apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__]);\n([graphql_ws__WEBPACK_IMPORTED_MODULE_3__, apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nlet apolloClient;\nconst errorLink = (0,_apollo_client_link_error__WEBPACK_IMPORTED_MODULE_4__.onError)(({ graphQLErrors, networkError, operation, forward })=>{\n    if (graphQLErrors) {\n        graphQLErrors.forEach(({ message, locations, path, extensions })=>{\n            if (message && message.includes(\"Expected Iterable\")) {\n                console.warn(`[GraphQL warning]: Field ${path?.join(\".\") || \"unknown\"} returned non-iterable value. This will be normalized to an empty array.`);\n            } else {\n                console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);\n            }\n        });\n    }\n    if (networkError) {\n        console.error(`[Network error]: ${networkError}`);\n    }\n});\nconst authLink = new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloLink((operation, forward)=>{\n    operation.setContext(({ headers = {} })=>({\n            headers: {\n                ...headers,\n                ...(0,_utils__WEBPACK_IMPORTED_MODULE_6__.getHeaders)()\n            }\n        }));\n    return forward(operation);\n});\nconst httpLink = (0,apollo_upload_client__WEBPACK_IMPORTED_MODULE_5__.createUploadLink)({\n    uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || \"http://localhost:3010/graphql\",\n    credentials: \"include\"\n});\nconst wsLink =  false ? 0 : null;\nconst splitLink =  false ? 0 : httpLink;\nfunction createApolloClient() {\n    return new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloClient({\n        link: _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloLink.from([\n            errorLink,\n            authLink,\n            splitLink\n        ]),\n        cache: new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.InMemoryCache({\n            typePolicies: {\n                Query: {\n                    fields: {}\n                },\n                Organization: {\n                    fields: {\n                        orgSkills: {\n                            read (existing) {\n                                if (!existing) return [];\n                                if (Array.isArray(existing)) return existing;\n                                if (typeof existing === \"string\") return [\n                                    existing\n                                ];\n                                return [];\n                            },\n                            merge (existing, incoming) {\n                                if (!incoming) return [];\n                                if (Array.isArray(incoming)) return incoming;\n                                if (typeof incoming === \"string\") return [\n                                    incoming\n                                ];\n                                return [];\n                            }\n                        },\n                        industries: {\n                            read (existing) {\n                                if (!existing) return [];\n                                if (Array.isArray(existing)) return existing;\n                                if (typeof existing === \"string\") return [\n                                    existing\n                                ];\n                                return [];\n                            },\n                            merge (existing, incoming) {\n                                if (!incoming) return [];\n                                if (Array.isArray(incoming)) return incoming;\n                                if (typeof existing === \"string\") return [\n                                    incoming\n                                ];\n                                return [];\n                            }\n                        }\n                    }\n                }\n            }\n        }),\n        defaultOptions: {\n            watchQuery: {\n                fetchPolicy: \"cache-and-network\"\n            },\n            query: {\n                fetchPolicy: \"network-only\"\n            }\n        }\n    });\n}\nfunction initializeApollo(initialState = null) {\n    const _apolloClient = apolloClient ?? createApolloClient();\n    if (initialState) {\n        _apolloClient.cache.restore(initialState);\n    }\n    if (true) return _apolloClient;\n    if (!apolloClient) apolloClient = _apolloClient;\n    return _apolloClient;\n}\nfunction useApollo(initialState) {\n    return initializeApollo(initialState);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJSCxNQUFNQyxPQUFPLENBQUNFLFdBQVcsT0FBT0E7Z0NBQ3BDLElBQUksT0FBT0osYUFBYSxVQUFVLE9BQU87b0NBQUNJO2lDQUFTO2dDQUNuRCxPQUFPLEVBQUU7NEJBQ1g7d0JBQ0Y7b0JBQ0Y7Z0JBQ0Y7WUFDRjtRQUNGO1FBQ0FFLGdCQUFnQjtZQUNkQyxZQUFZO2dCQUNWQyxhQUFhO1lBQ2Y7WUFDQXJCLE9BQU87Z0JBQ0xxQixhQUFhO1lBQ2Y7UUFDRjtJQUNGO0FBQ0Y7QUFFTyxTQUFTQyxpQkFBaUJDLGVBQWUsSUFBSTtJQUNsRCxNQUFNQyxnQkFBZ0J4RCxnQkFBZ0JtQztJQUV0QyxJQUFJb0IsY0FBYztRQUNoQkMsY0FBY2xCLEtBQUssQ0FBQ21CLE9BQU8sQ0FBQ0Y7SUFDOUI7SUFFQSxJQUFJLElBQWtCLEVBQWEsT0FBT0M7SUFFMUMsSUFBSSxDQUFDeEQsY0FBY0EsZUFBZXdEO0lBRWxDLE9BQU9BO0FBQ1Q7QUFFTyxTQUFTRSxVQUFVSCxZQUFpQjtJQUN6QyxPQUFPRCxpQkFBaUJDO0FBQzFCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21lY29ubmVjdC1sYW5kaW5nLXBhZ2UvLi9hcG9sbG8vY2xpZW50LnRzPzI5NTQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBvbGxvQ2xpZW50LCBJbk1lbW9yeUNhY2hlLCBBcG9sbG9MaW5rLCBzcGxpdCB9IGZyb20gJ0BhcG9sbG8vY2xpZW50JztcbmltcG9ydCB7IGdldE1haW5EZWZpbml0aW9uIH0gZnJvbSAnQGFwb2xsby9jbGllbnQvdXRpbGl0aWVzJztcbmltcG9ydCB7IEdyYXBoUUxXc0xpbmsgfSBmcm9tICdAYXBvbGxvL2NsaWVudC9saW5rL3N1YnNjcmlwdGlvbnMnO1xuaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnZ3JhcGhxbC13cyc7XG5pbXBvcnQgeyBvbkVycm9yIH0gZnJvbSAnQGFwb2xsby9jbGllbnQvbGluay9lcnJvcic7XG5pbXBvcnQgeyBjcmVhdGVVcGxvYWRMaW5rIH0gZnJvbSAnYXBvbGxvLXVwbG9hZC1jbGllbnQnO1xuaW1wb3J0IHsgZ2V0SGVhZGVycyB9IGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgYXBvbGxvQ2xpZW50OiBBcG9sbG9DbGllbnQ8YW55PjtcblxuY29uc3QgZXJyb3JMaW5rID0gb25FcnJvcigoeyBncmFwaFFMRXJyb3JzLCBuZXR3b3JrRXJyb3IsIG9wZXJhdGlvbiwgZm9yd2FyZCB9KSA9PiB7XG4gIGlmIChncmFwaFFMRXJyb3JzKSB7XG4gICAgZ3JhcGhRTEVycm9ycy5mb3JFYWNoKCh7IG1lc3NhZ2UsIGxvY2F0aW9ucywgcGF0aCwgZXh0ZW5zaW9ucyB9KSA9PiB7XG4gICAgICBpZiAobWVzc2FnZSAmJiBtZXNzYWdlLmluY2x1ZGVzKCdFeHBlY3RlZCBJdGVyYWJsZScpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgW0dyYXBoUUwgd2FybmluZ106IEZpZWxkICR7cGF0aD8uam9pbignLicpIHx8ICd1bmtub3duJ30gcmV0dXJuZWQgbm9uLWl0ZXJhYmxlIHZhbHVlLiBUaGlzIHdpbGwgYmUgbm9ybWFsaXplZCB0byBhbiBlbXB0eSBhcnJheS5gXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIGBbR3JhcGhRTCBlcnJvcl06IE1lc3NhZ2U6ICR7bWVzc2FnZX0sIExvY2F0aW9uOiAke2xvY2F0aW9uc30sIFBhdGg6ICR7cGF0aH1gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpZiAobmV0d29ya0Vycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgW05ldHdvcmsgZXJyb3JdOiAke25ldHdvcmtFcnJvcn1gKTtcbiAgfVxufSk7XG5cbmNvbnN0IGF1dGhMaW5rID0gbmV3IEFwb2xsb0xpbmsoKG9wZXJhdGlvbiwgZm9yd2FyZCkgPT4ge1xuICBvcGVyYXRpb24uc2V0Q29udGV4dCgoeyBoZWFkZXJzID0ge30gfSkgPT4gKHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAuLi5oZWFkZXJzLFxuICAgICAgLi4uZ2V0SGVhZGVycygpLFxuICAgIH0sXG4gIH0pKTtcbiAgcmV0dXJuIGZvcndhcmQob3BlcmF0aW9uKTtcbn0pO1xuXG5jb25zdCBodHRwTGluayA9IGNyZWF0ZVVwbG9hZExpbmsoe1xuICB1cmk6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQSV9HUkFQSFFMX1VSTCB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfQVBJX0dSQVBIUUxfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMTAvZ3JhcGhxbCcsXG4gIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXG59KTtcblxuY29uc3Qgd3NMaW5rID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgPyBuZXcgR3JhcGhRTFdzTGluayhcbiAgICAgIGNyZWF0ZUNsaWVudCh7XG4gICAgICAgIHVybDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVBJX1dTIHx8IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9BUElfV1MgfHwgJ3dzOi8vbG9jYWxob3N0OjMwMTAvZ3JhcGhxbCcsXG4gICAgICAgIGNvbm5lY3Rpb25QYXJhbXM6ICgpID0+ICh7XG4gICAgICAgICAgLi4uZ2V0SGVhZGVycygpLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgKVxuICA6IG51bGw7XG5cbmNvbnN0IHNwbGl0TGluayA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdzTGlua1xuICA/IHNwbGl0KFxuICAgICAgKHsgcXVlcnkgfSkgPT4ge1xuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gZ2V0TWFpbkRlZmluaXRpb24ocXVlcnkpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGRlZmluaXRpb24ua2luZCA9PT0gJ09wZXJhdGlvbkRlZmluaXRpb24nICYmXG4gICAgICAgICAgZGVmaW5pdGlvbi5vcGVyYXRpb24gPT09ICdzdWJzY3JpcHRpb24nXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgd3NMaW5rLFxuICAgICAgaHR0cExpbmtcbiAgICApXG4gIDogaHR0cExpbms7XG5cbmZ1bmN0aW9uIGNyZWF0ZUFwb2xsb0NsaWVudCgpIHtcbiAgcmV0dXJuIG5ldyBBcG9sbG9DbGllbnQoe1xuICAgIGxpbms6IEFwb2xsb0xpbmsuZnJvbShbZXJyb3JMaW5rLCBhdXRoTGluaywgc3BsaXRMaW5rXSksXG4gICAgY2FjaGU6IG5ldyBJbk1lbW9yeUNhY2hlKHtcbiAgICAgIHR5cGVQb2xpY2llczoge1xuICAgICAgICBRdWVyeToge1xuICAgICAgICAgIGZpZWxkczoge30sXG4gICAgICAgIH0sXG4gICAgICAgIE9yZ2FuaXphdGlvbjoge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3JnU2tpbGxzOiB7XG4gICAgICAgICAgICAgIHJlYWQoZXhpc3RpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWV4aXN0aW5nKSByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXhpc3RpbmcpKSByZXR1cm4gZXhpc3Rpbmc7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ3N0cmluZycpIHJldHVybiBbZXhpc3RpbmddO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVyZ2UoZXhpc3RpbmcsIGluY29taW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbmNvbWluZykgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGluY29taW5nKSkgcmV0dXJuIGluY29taW5nO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5jb21pbmcgPT09ICdzdHJpbmcnKSByZXR1cm4gW2luY29taW5nXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5kdXN0cmllczoge1xuICAgICAgICAgICAgICByZWFkKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFleGlzdGluZykgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGV4aXN0aW5nKSkgcmV0dXJuIGV4aXN0aW5nO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgPT09ICdzdHJpbmcnKSByZXR1cm4gW2V4aXN0aW5nXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lcmdlKGV4aXN0aW5nLCBpbmNvbWluZykge1xuICAgICAgICAgICAgICAgIGlmICghaW5jb21pbmcpIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbmNvbWluZykpIHJldHVybiBpbmNvbWluZztcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnc3RyaW5nJykgcmV0dXJuIFtpbmNvbWluZ107XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICBkZWZhdWx0T3B0aW9uczoge1xuICAgICAgd2F0Y2hRdWVyeToge1xuICAgICAgICBmZXRjaFBvbGljeTogJ2NhY2hlLWFuZC1uZXR3b3JrJyxcbiAgICAgIH0sXG4gICAgICBxdWVyeToge1xuICAgICAgICBmZXRjaFBvbGljeTogJ25ldHdvcmstb25seScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUFwb2xsbyhpbml0aWFsU3RhdGUgPSBudWxsKSB7XG4gIGNvbnN0IF9hcG9sbG9DbGllbnQgPSBhcG9sbG9DbGllbnQgPz8gY3JlYXRlQXBvbGxvQ2xpZW50KCk7XG5cbiAgaWYgKGluaXRpYWxTdGF0ZSkge1xuICAgIF9hcG9sbG9DbGllbnQuY2FjaGUucmVzdG9yZShpbml0aWFsU3RhdGUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gX2Fwb2xsb0NsaWVudDtcblxuICBpZiAoIWFwb2xsb0NsaWVudCkgYXBvbGxvQ2xpZW50ID0gX2Fwb2xsb0NsaWVudDtcblxuICByZXR1cm4gX2Fwb2xsb0NsaWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFwb2xsbyhpbml0aWFsU3RhdGU6IGFueSkge1xuICByZXR1cm4gaW5pdGlhbGl6ZUFwb2xsbyhpbml0aWFsU3RhdGUpO1xufVxuIl0sIm5hbWVzIjpbIkFwb2xsb0NsaWVudCIsIkluTWVtb3J5Q2FjaGUiLCJBcG9sbG9MaW5rIiwic3BsaXQiLCJnZXRNYWluRGVmaW5pdGlvbiIsIkdyYXBoUUxXc0xpbmsiLCJjcmVhdGVDbGllbnQiLCJvbkVycm9yIiwiY3JlYXRlVXBsb2FkTGluayIsImdldEhlYWRlcnMiLCJhcG9sbG9DbGllbnQiLCJlcnJvckxpbmsiLCJncmFwaFFMRXJyb3JzIiwibmV0d29ya0Vycm9yIiwib3BlcmF0aW9uIiwiZm9yd2FyZCIsImZvckVhY2giLCJtZXNzYWdlIiwibG9jYXRpb25zIiwicGF0aCIsImV4dGVuc2lvbnMiLCJpbmNsdWRlcyIsImNvbnNvbGUiLCJ3YXJuIiwiam9pbiIsImVycm9yIiwiYXV0aExpbmsiLCJzZXRDb250ZXh0IiwiaGVhZGVycyIsImh0dHBMaW5rIiwidXJpIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0FQSV9HUkFQSFFMX1VSTCIsIlJFQUNUX0FQUF9BUElfR1JBUEhRTF9VUkwiLCJjcmVkZW50aWFscyIsIndzTGluayIsInVybCIsIk5FWFRfUFVCTElDX0FQSV9XUyIsIlJFQUNUX0FQUF9BUElfV1MiLCJjb25uZWN0aW9uUGFyYW1zIiwic3BsaXRMaW5rIiwicXVlcnkiLCJkZWZpbml0aW9uIiwia2luZCIsImNyZWF0ZUFwb2xsb0NsaWVudCIsImxpbmsiLCJmcm9tIiwiY2FjaGUiLCJ0eXBlUG9saWNpZXMiLCJRdWVyeSIsImZpZWxkcyIsIk9yZ2FuaXphdGlvbiIsIm9yZ1NraWxscyIsInJlYWQiLCJleGlzdGluZyIsIkFycmF5IiwiaXNBcnJheSIsIm1lcmdlIiwiaW5jb21pbmciLCJpbmR1c3RyaWVzIiwiZGVmYXVsdE9wdGlvbnMiLCJ3YXRjaFF1ZXJ5IiwiZmV0Y2hQb2xpY3kiLCJpbml0aWFsaXplQXBvbGxvIiwiaW5pdGlhbFN0YXRlIiwiX2Fwb2xsb0NsaWVudCIsInJlc3RvcmUiLCJ1c2VBcG9sbG8iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./apollo/client.ts\n");

/***/ }),

/***/ "./apollo/utils.ts":
/*!*************************!*\
  !*** ./apollo/utils.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getHeaders: () => (/* binding */ getHeaders)\n/* harmony export */ });\nfunction getHeaders() {\n    const headers = {};\n    if (false) {}\n    return headers;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9hcG9sbG8vdXRpbHMudHMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPLFNBQVNBO0lBQ2QsTUFBTUMsVUFBa0MsQ0FBQztJQUV6QyxJQUFJLEtBQWtCLEVBQWEsRUFLbEM7SUFFRCxPQUFPQTtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21lY29ubmVjdC1sYW5kaW5nLXBhZ2UvLi9hcG9sbG8vdXRpbHMudHM/N2VjNSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0SGVhZGVycygpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgY29uc3QgaGVhZGVyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY2Vzc1Rva2VuJyk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBoZWFkZXJzWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaGVhZGVycztcbn1cbiJdLCJuYW1lcyI6WyJnZXRIZWFkZXJzIiwiaGVhZGVycyIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./apollo/utils.ts\n");

/***/ }),

/***/ "./libs/contexts/ThemeContext.tsx":
/*!****************************************!*\
  !*** ./libs/contexts/ThemeContext.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction ThemeProvider({ children }) {\n    const [theme, setTheme] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"light\");\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setMounted(true);\n        // Check localStorage for saved theme preference\n        const savedTheme = localStorage.getItem(\"theme\");\n        if (savedTheme) {\n            setTheme(savedTheme);\n        } else if (window.matchMedia(\"(prefers-color-scheme: dark)\").matches) {\n            setTheme(\"dark\");\n        }\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (mounted) {\n            localStorage.setItem(\"theme\", theme);\n            if (theme === \"dark\") {\n                document.documentElement.classList.add(\"dark\");\n            } else {\n                document.documentElement.classList.remove(\"dark\");\n            }\n        }\n    }, [\n        theme,\n        mounted\n    ]);\n    const toggleTheme = ()=>{\n        setTheme((prev)=>prev === \"light\" ? \"dark\" : \"light\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            theme,\n            toggleTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/libs/contexts/ThemeContext.tsx\",\n        lineNumber: 43,\n        columnNumber: 5\n    }, this);\n}\nfunction useTheme() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n    if (context === undefined) {\n        throw new Error(\"useTheme must be used within a ThemeProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWJzL2NvbnRleHRzL1RoZW1lQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUE4RTtBQVM5RSxNQUFNSyw2QkFBZUosb0RBQWFBLENBQStCSztBQUUxRCxTQUFTQyxjQUFjLEVBQUVDLFFBQVEsRUFBaUM7SUFDdkUsTUFBTSxDQUFDQyxPQUFPQyxTQUFTLEdBQUdOLCtDQUFRQSxDQUFRO0lBQzFDLE1BQU0sQ0FBQ08sU0FBU0MsV0FBVyxHQUFHUiwrQ0FBUUEsQ0FBQztJQUV2Q0QsZ0RBQVNBLENBQUM7UUFDUlMsV0FBVztRQUNYLGdEQUFnRDtRQUNoRCxNQUFNQyxhQUFhQyxhQUFhQyxPQUFPLENBQUM7UUFDeEMsSUFBSUYsWUFBWTtZQUNkSCxTQUFTRztRQUNYLE9BQU8sSUFBSUcsT0FBT0MsVUFBVSxDQUFDLGdDQUFnQ0MsT0FBTyxFQUFFO1lBQ3BFUixTQUFTO1FBQ1g7SUFDRixHQUFHLEVBQUU7SUFFTFAsZ0RBQVNBLENBQUM7UUFDUixJQUFJUSxTQUFTO1lBQ1hHLGFBQWFLLE9BQU8sQ0FBQyxTQUFTVjtZQUM5QixJQUFJQSxVQUFVLFFBQVE7Z0JBQ3BCVyxTQUFTQyxlQUFlLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDO1lBQ3pDLE9BQU87Z0JBQ0xILFNBQVNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDRSxNQUFNLENBQUM7WUFDNUM7UUFDRjtJQUNGLEdBQUc7UUFBQ2Y7UUFBT0U7S0FBUTtJQUVuQixNQUFNYyxjQUFjO1FBQ2xCZixTQUFTZ0IsQ0FBQUEsT0FBUUEsU0FBUyxVQUFVLFNBQVM7SUFDL0M7SUFFQSxxQkFDRSw4REFBQ3JCLGFBQWFzQixRQUFRO1FBQUNDLE9BQU87WUFBRW5CO1lBQU9nQjtRQUFZO2tCQUNoRGpCOzs7Ozs7QUFHUDtBQUVPLFNBQVNxQjtJQUNkLE1BQU1DLFVBQVU1QixpREFBVUEsQ0FBQ0c7SUFDM0IsSUFBSXlCLFlBQVl4QixXQUFXO1FBQ3pCLE1BQU0sSUFBSXlCLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21lY29ubmVjdC1sYW5kaW5nLXBhZ2UvLi9saWJzL2NvbnRleHRzL1RoZW1lQ29udGV4dC50c3g/ODBjYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxudHlwZSBUaGVtZSA9ICdsaWdodCcgfCAnZGFyayc7XG5cbmludGVyZmFjZSBUaGVtZUNvbnRleHRUeXBlIHtcbiAgdGhlbWU6IFRoZW1lO1xuICB0b2dnbGVUaGVtZTogKCkgPT4gdm9pZDtcbn1cblxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxUaGVtZUNvbnRleHRUeXBlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhlbWVQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XG4gIGNvbnN0IFt0aGVtZSwgc2V0VGhlbWVdID0gdXNlU3RhdGU8VGhlbWU+KCdsaWdodCcpO1xuICBjb25zdCBbbW91bnRlZCwgc2V0TW91bnRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXRNb3VudGVkKHRydWUpO1xuICAgIC8vIENoZWNrIGxvY2FsU3RvcmFnZSBmb3Igc2F2ZWQgdGhlbWUgcHJlZmVyZW5jZVxuICAgIGNvbnN0IHNhdmVkVGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSBhcyBUaGVtZTtcbiAgICBpZiAoc2F2ZWRUaGVtZSkge1xuICAgICAgc2V0VGhlbWUoc2F2ZWRUaGVtZSk7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMpIHtcbiAgICAgIHNldFRoZW1lKCdkYXJrJyk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobW91bnRlZCkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgdGhlbWUpO1xuICAgICAgaWYgKHRoZW1lID09PSAnZGFyaycpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RhcmsnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrJyk7XG4gICAgICB9XG4gICAgfVxuICB9LCBbdGhlbWUsIG1vdW50ZWRdKTtcblxuICBjb25zdCB0b2dnbGVUaGVtZSA9ICgpID0+IHtcbiAgICBzZXRUaGVtZShwcmV2ID0+IHByZXYgPT09ICdsaWdodCcgPyAnZGFyaycgOiAnbGlnaHQnKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgdGhlbWUsIHRvZ2dsZVRoZW1lIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvVGhlbWVDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlVGhlbWUoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KFRoZW1lQ29udGV4dCk7XG4gIGlmIChjb250ZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZVRoZW1lIG11c3QgYmUgdXNlZCB3aXRoaW4gYSBUaGVtZVByb3ZpZGVyJyk7XG4gIH1cbiAgcmV0dXJuIGNvbnRleHQ7XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiVGhlbWVDb250ZXh0IiwidW5kZWZpbmVkIiwiVGhlbWVQcm92aWRlciIsImNoaWxkcmVuIiwidGhlbWUiLCJzZXRUaGVtZSIsIm1vdW50ZWQiLCJzZXRNb3VudGVkIiwic2F2ZWRUaGVtZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInNldEl0ZW0iLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInRvZ2dsZVRoZW1lIiwicHJldiIsIlByb3ZpZGVyIiwidmFsdWUiLCJ1c2VUaGVtZSIsImNvbnRleHQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./libs/contexts/ThemeContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../apollo/client */ \"./apollo/client.ts\");\n/* harmony import */ var _libs_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../libs/contexts/ThemeContext */ \"./libs/contexts/ThemeContext.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _scss_app_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../scss/app.scss */ \"./scss/app.scss\");\n/* harmony import */ var _scss_app_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_scss_app_scss__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _barrel_optimize_names_CssBaseline_mui_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! __barrel_optimize__?names=CssBaseline!=!@mui/material */ \"__barrel_optimize__?names=CssBaseline!=!./node_modules/@mui/material/index.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_apollo_client__WEBPACK_IMPORTED_MODULE_2__]);\n_apollo_client__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    const apolloClient = (0,_apollo_client__WEBPACK_IMPORTED_MODULE_2__.useApollo)(pageProps.initialApolloState);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_apollo_client__WEBPACK_IMPORTED_MODULE_1__.ApolloProvider, {\n        client: apolloClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_libs_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_3__.ThemeProvider, {\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_CssBaseline_mui_material__WEBPACK_IMPORTED_MODULE_6__.CssBaseline, {}, void 0, false, {\n                    fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/pages/_app.tsx\",\n                    lineNumber: 15,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/pages/_app.tsx\",\n                    lineNumber: 16,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/pages/_app.tsx\",\n            lineNumber: 14,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/mynewlife2778gmail.com/Documents/UI challenge/smeconnect-landing-page/pages/_app.tsx\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ2dEO0FBQ0g7QUFDaUI7QUFDL0I7QUFDTDtBQUNrQjtBQUU3QixTQUFTSSxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELE1BQU1DLGVBQWVOLHlEQUFTQSxDQUFDSyxVQUFVRSxrQkFBa0I7SUFFM0QscUJBQ0UsOERBQUNSLDBEQUFjQTtRQUFDUyxRQUFRRjtrQkFDdEIsNEVBQUNMLHNFQUFhQTs7OEJBQ1osOERBQUNDLHdGQUFXQTs7Ozs7OEJBQ1osOERBQUNFO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSWhDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc21lY29ubmVjdC1sYW5kaW5nLXBhZ2UvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCc7XG5pbXBvcnQgeyBBcG9sbG9Qcm92aWRlciB9IGZyb20gJ0BhcG9sbG8vY2xpZW50JztcbmltcG9ydCB7IHVzZUFwb2xsbyB9IGZyb20gJy4uL2Fwb2xsby9jbGllbnQnO1xuaW1wb3J0IHsgVGhlbWVQcm92aWRlciB9IGZyb20gJy4uL2xpYnMvY29udGV4dHMvVGhlbWVDb250ZXh0JztcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcbmltcG9ydCAnLi4vc2Nzcy9hcHAuc2Nzcyc7XG5pbXBvcnQgeyBDc3NCYXNlbGluZSB9IGZyb20gJ0BtdWkvbWF0ZXJpYWwnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICBjb25zdCBhcG9sbG9DbGllbnQgPSB1c2VBcG9sbG8ocGFnZVByb3BzLmluaXRpYWxBcG9sbG9TdGF0ZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8QXBvbGxvUHJvdmlkZXIgY2xpZW50PXthcG9sbG9DbGllbnR9PlxuICAgICAgPFRoZW1lUHJvdmlkZXI+XG4gICAgICAgIDxDc3NCYXNlbGluZSAvPlxuICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICA8L1RoZW1lUHJvdmlkZXI+XG4gICAgPC9BcG9sbG9Qcm92aWRlcj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJBcG9sbG9Qcm92aWRlciIsInVzZUFwb2xsbyIsIlRoZW1lUHJvdmlkZXIiLCJDc3NCYXNlbGluZSIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImFwb2xsb0NsaWVudCIsImluaXRpYWxBcG9sbG9TdGF0ZSIsImNsaWVudCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./scss/app.scss":
/*!***********************!*\
  !*** ./scss/app.scss ***!
  \***********************/
/***/ (() => {



/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@apollo/client":
/*!*********************************!*\
  !*** external "@apollo/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client");

/***/ }),

/***/ "@apollo/client/link/error":
/*!********************************************!*\
  !*** external "@apollo/client/link/error" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client/link/error");

/***/ }),

/***/ "@apollo/client/link/subscriptions":
/*!****************************************************!*\
  !*** external "@apollo/client/link/subscriptions" ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client/link/subscriptions");

/***/ }),

/***/ "@apollo/client/utilities":
/*!*******************************************!*\
  !*** external "@apollo/client/utilities" ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client/utilities");

/***/ }),

/***/ "@mui/system":
/*!******************************!*\
  !*** external "@mui/system" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system");

/***/ }),

/***/ "@mui/system/DefaultPropsProvider":
/*!***************************************************!*\
  !*** external "@mui/system/DefaultPropsProvider" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/DefaultPropsProvider");

/***/ }),

/***/ "@mui/system/colorManipulator":
/*!***********************************************!*\
  !*** external "@mui/system/colorManipulator" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/colorManipulator");

/***/ }),

/***/ "@mui/system/createTheme":
/*!******************************************!*\
  !*** external "@mui/system/createTheme" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/createTheme");

/***/ }),

/***/ "@mui/system/styleFunctionSx":
/*!**********************************************!*\
  !*** external "@mui/system/styleFunctionSx" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/system/styleFunctionSx");

/***/ }),

/***/ "@mui/utils/deepmerge":
/*!***************************************!*\
  !*** external "@mui/utils/deepmerge" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/utils/deepmerge");

/***/ }),

/***/ "@mui/utils/formatMuiErrorMessage":
/*!***************************************************!*\
  !*** external "@mui/utils/formatMuiErrorMessage" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/utils/formatMuiErrorMessage");

/***/ }),

/***/ "@mui/utils/generateUtilityClass":
/*!**************************************************!*\
  !*** external "@mui/utils/generateUtilityClass" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@mui/utils/generateUtilityClass");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("prop-types");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "apollo-upload-client":
/*!***************************************!*\
  !*** external "apollo-upload-client" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = import("apollo-upload-client");;

/***/ }),

/***/ "graphql-ws":
/*!*****************************!*\
  !*** external "graphql-ws" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = import("graphql-ws");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@mui","vendor-chunks/@babel"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();