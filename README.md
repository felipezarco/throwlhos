# Throwlhos

> Throws error objects with status and code

```typescript
throw Error('What the heck goes here?...')
```
You do not know exactly what to throw?! We've got you covered! 
![image](https://user-images.githubusercontent.com/11004919/186556459-a515de65-2adc-43b7-a2fc-1eb0a2be076c.png)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/throwlhos.svg)](https://badge.fury.io/js/felipezarco%2Fthrowlhos) [![Build Status](https://travis-ci.org/felipezarco/throwlhos.svg?branch=master)](https://travis-ci.org/felipezarco/throwlhos) [![Coverage Status](https://coveralls.io/repos/github/felipezarco/throwlhos/badge.svg?branch=master)](https://coveralls.io/github/felipezarco/throwlhos?branch=master) ![Downloads](https://img.shields.io/npm/dw/throwlhos)

[![npm](https://nodei.co/npm/throwlhos.png)](https://www.npmjs.com/package/throwlhos)

## Installation

The latest version is available at: https://www.npmjs.com/package/throwlhos

Use your favorite package manager to install. For instance: 

```
  yarn add throwlhos
```

## Basic Usage

```typescript
import throwlhos from 'throwlhos'
import { Request, Response } from 'express'

class FooBarController {
  async index(request: Request, response: Response) {
    console.log(throwlhos.err_internalServerError())
    // IThrowlhos object
  }
}
```

Above code prompts the following output:
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
errors?: any
```

Returned **`throwlhos`** object type exaplained:

````typescript
export type IThrowlhos = {
  code: number
  status: string
  message: string
  errors: any
}
````
* **`code`**: Number value of `HTTP Status Code`

* **`status`**: String value of `HTTP Status Name`

* **`message`**: Message given at first parameter or `HTTP Status Name human-readable` if none or **null** is given.

* **`errors`**: Anything given as the second parameter. It's `undefined` if no value is given.

## Throwlhos as an express middleware

You can use **`throwlhos`** as an express middleware:

```typescript
app.use(throwlhos.middlware)
```

Since **`throwlhos`** overwrites [Express](https://www.npmjs.com/package/express) interface, you can find **`throwlhos`** `err_*` methods directly in express response! 

Consider the following code which is an [express middlware](https://expressjs.com/en/guide/writing-middleware.html):

```typescript
import throwlhos from 'throwlhos'
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

## Usage with an express Error Handler (recommended)

If you want to quickly send an error response with your **`throwlhos`** use it with [responserror](https://www.npmjs.com/package/throwlhos).

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
  app.use(throwlhos.middlware)
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

## Available Methods

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
err_custom // Custom Error (provide message, code and errors)
````

## More

Special thanks to my fellow engineer [Estanis](https://github.com/Christopher-Estanis) as his words where my inspiration in the naming of the package.

## Testing

Run the test suit with `yarn test`.

## Contributing

If you want to contribute in any of theses ways:

- Give your ideas or feedback
- Question something
- Point out a problem or issue
- Enhance the code or its documentation
- Help in any other way

You can (and should) [open an issue](https://github.com/felipezarco/throwlhos/issues/new) or even a [pull request](https://github.com/felipezarco/throwlhos/compare).

Has this package been useful for you? 

If so, you can **contribute by giving it a Star ⭐** at the [GitHub Repository](https://github.com/felipezarco/throwlhos)!

Thanks for your interest in contributing to this repo!

## Author

[Luiz Felipe Zarco](https://github.com/felipezarco) (felipezarco@hotmail.com)

## License

This code is licensed under the [MIT License](https://github.com/felipezarco/throwlhos/blob/master/LICENSE.md). See the [LICENSE.md](https://github.com/felipezarco/throwlhos/blob/master/LICENSE.md) file for more info.
