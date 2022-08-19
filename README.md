# Throwlhos

> Throw error objects directly from express response

```typescript
throw Error('What the heck goes here?...')
```

So... You do not know exactly what to throw?! `Throwlhos` got you covered!


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/throwlhos.svg)](https://badge.fury.io/js/felipezarco%2Fthrowlhos) [![Build Status](https://travis-ci.org/felipezarco/throwlhos.svg?branch=master)](https://travis-ci.org/felipezarco/throwlhos) [![Coverage Status](https://coveralls.io/repos/github/felipezarco/throwlhos/badge.svg?branch=master)](https://coveralls.io/github/felipezarco/throwlhos?branch=master) ![Downloads](https://img.shields.io/npm/dw/throwlhos)

[![npm](https://nodei.co/npm/throwlhos.png)](https://www.npmjs.com/package/throwlhos)

## Installation

The latest version is available at: https://www.npmjs.com/package/throwlhos

Use your favorite package manager to install. For instance: 

```
  yarn add throwlhos
```

Then import it:

```javascript
import throwlhos from 'throwlhos'
```

**Add `throwlhos` as an express middleware**:

```typescript
app.use(throwlhos)
```

And you're good to go!

## Usage

Since `throwlhos` overwrites [Express](https://www.npmjs.com/package/express) interface, you can find `throwlhos` `err_*` methods directly in express response! 

Consider the following code which is an [express middlware](https://expressjs.com/en/guide/writing-middleware.html):

```typescript
import { Request, Response } from 'express'

class FooBarController {
  async index(request: Request, response: Response) {
    const throwlhos = response.err_internalServerError()
    return response.status(throwlhos.code).send(throwlhos)
  }
}
```

Outputs:
```
HTTP/1.1 500 INTERNAL_SERVER_ERROR
X-Powered-By: Express
errors-Type: application/json; charset=utf-8
```
```typescript
{
  code: 500,
  status: 'INTERNAL_SERVER_ERROR',
  message: 'Internal Server Error'
} 
```

`err_*` methods accept two **optional** parameters:

```typescript
message?: string | null
errors?: {}
```

Returned `throwlhos` object type exaplained:

````typescript
export type IThrowlhos = {
  code: number
  status: string
  message: string
  errors: any
}
````

* `code`: Number value of `HTTP Status Code`

* `status`: String value of `HTTP Status Name`

* `message`: Given message as first parameter. Or `HTTP Status Name human-readable` if `null` or none is given.

* `errors`: Anything given as a second parameter. It is `undefined` if none is given.

## Methods

Throwlhos currently supports following methods:

````typescript
err_multipleChoices // Multiple Choices
err_movedPermanently // Moved Permanently
err_movedTemporarily // Moved Temporarily
err_seeOther // See Other
err_notModified // Not Modified
err_useProxy // Use Proxy
err_temporaryRedirect // Temporary Redirect
err_permanentRedirect // Permanent Redirect
err_badRequest // Bad Request
err_unauthorized // Unauthorized
err_paymentRequired // Payment Required
err_forbidden // Forbidden
err_notFound // Not Found
err_methodNotAllowed // Method Not Allowed
err_notAcceptable // Not Acceptable
err_proxyAuthenticationRequired // Proxy Authentication Required
err_requestTimeout // Request Timeout
err_conflict // Conflict
err_gone // Gone
err_lengthRequired // Length Required
err_preconditionFailed // Precondition Failed
err_requestTooLong // Request Entity Too Large
err_requestUriTooLong // Request-URI Too Long
err_unsupportedMediaType // Unsupported Media Type
err_requestedRangeNotSatisfiable // Requested Range Not Satisfiable
err_expectationFailed // Expectation Failed
err_imATeapot // I'm a teapot
err_insufficientSpaceOnResource // Insufficient Space on Resource
err_methodFailure // Method Failure
err_misdirectedRequest // Misdirected Request
err_unprocessableEntity // Unprocessable Entity
err_locked // Locked
err_failedDependency // Failed Dependency
err_preconditionRequired // Precondition Required
err_tooManyRequests // Too Many Requests
err_requestHeaderFieldsTooLarge // Request Header Fields Too Large
err_unavailableForLegalReasons // Unavailable For Legal Reasons
err_internalServerError // Internal Server Error
err_notImplemented // Not Implemented
err_badGateway // Bad Gateway
err_serviceUnavailable // Service Unavailable
err_gatewayTimeout // Gateway Timeout
err_httpVersionNotSupported // HTTP Version Not Supported
err_insufficientStorage // Insufficient Storage
err_networkAuthenticationRequired // Network Authentication Required
````

## Error Handler (recommended)

If you want to quickly send an error response with your `throwlhos` use it with [responserror](https://www.npmjs.com/package/throwlhos).

Responserror handler will catch-all errors from any express middleware router in-between by using `next(err)` .

Full example:

```typescript
  import throwlhos from 'throwlhos'
  import errorHandler from 'responserror'
  const app = express()
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      throw response.err_forbidden('Access denied.. Sorry')
    } catch(err) {
      return next(err)
    }
  })
  app.use(throwlhos)
  app.use(router)
  app.use(errorHandler)
```

`POST /resources` outputs:
```
HTTP/1.1 403 FORBIDDEN
X-Powered-By: Express
errors-Type: application/json; charset=utf-8
```
```typescript
{
  code: 403,
  status: 'FORBIDDEN',
  message: 'Access denied.. Sorry',
  success: false
}
```

## Testing

Run the test suit with `yarn test`.

## Contributing

If you want to contribute in any of theses ways:

- Give your ideas or feedback
- Question something
- Point out a problem or issue
- Enhance the code or its documentation
- Help in any other way

You can (and should) [open an issue](https://github.com/felipezarco/throwlhos/issues/new) or even a [pull request](https://github.com/felipezarco/throwlhos/compare)!

Thanks for your interest in contributing to this repo!

## Author

[Luiz Felipe Zarco](https://github.com/felipezarco) (felipezarco@hotmail.com)

## License

This code is licensed under the [MIT License](https://github.com/felipezarco/throwlhos/blob/master/LICENSE.md). See the [LICENSE.md](https://github.com/felipezarco/throwlhos/blob/master/LICENSE.md) file for more info.