import { Request, Response, NextFunction } from 'express'
import HttpStatus from 'http-status-codes'

const camelCase = (str: string) => str.toLowerCase().replace(/(\_\w)/g, c => c[1].toUpperCase())

export type IThrowlhos = {
  code: number
  status: string
  message: string
  errors: any
}

type IThrow = {
  function(message?: string | null, errors?: {}): IThrowlhos
}

declare global {
  namespace Express {
    interface Response {
      err_multipleChoices: IThrow['function']
      // Multiple Choices
      err_movedPermanently: IThrow['function']
      // Moved Permanently
      err_movedTemporarily: IThrow['function']
      // Moved Temporarily
      err_seeOther: IThrow['function']
      // See Other
      err_notModified: IThrow['function']
      // Not Modified
      err_useProxy: IThrow['function']
      // Use Proxy
      err_temporaryRedirect: IThrow['function']
      // Temporary Redirect
      err_permanentRedirect: IThrow['function']
      // Permanent Redirect
      err_badRequest: IThrow['function']
      // Bad Request
      err_unauthorized: IThrow['function']
      // Unauthorized
      err_paymentRequired: IThrow['function']
      // Payment Required
      err_forbidden: IThrow['function']
      // Forbidden
      err_notFound: IThrow['function']
      // Not Found
      err_methodNotAllowed: IThrow['function']
      // Method Not Allowed
      err_notAcceptable: IThrow['function']
      // Not Acceptable
      err_proxyAuthenticationRequired: IThrow['function']
      // Proxy Authentication Required
      err_requestTimeout: IThrow['function']
      // Request Timeout
      err_conflict: IThrow['function']
      // Conflict
      err_gone: IThrow['function']
      // Gone
      err_lengthRequired: IThrow['function']
      // Length Required
      err_preconditionFailed: IThrow['function']
      // Precondition Failed
      err_requestTooLong: IThrow['function']
      // Request Entity Too Large
      err_requestUriTooLong: IThrow['function']
      // Request-URI Too Long
      err_unsupportedMediaType: IThrow['function']
      // Unsupported Media Type
      err_requestedRangeNotSatisfiable: IThrow['function']
      // Requested Range Not Satisfiable
      err_expectationFailed: IThrow['function']
      // Expectation Failed
      err_imATeapot: IThrow['function']
      // I'm a teapot
      err_insufficientSpaceOnResource: IThrow['function']
      // Insufficient Space on Resource
      err_methodFailure: IThrow['function']
      // Method Failure
      err_misdirectedRequest: IThrow['function']
      // Misdirected Request
      err_unprocessableEntity: IThrow['function']
      // Unprocessable Entity
      err_locked: IThrow['function']
      // Locked
      err_failedDependency: IThrow['function']
      // Failed Dependency
      err_preconditionRequired: IThrow['function']
      // Precondition Required
      err_tooManyRequests: IThrow['function']
      // Too Many Requests
      err_requestHeaderFieldsTooLarge: IThrow['function']
      // Request Header Fields Too Large
      err_unavailableForLegalReasons: IThrow['function']
      // Unavailable For Legal Reasons
      err_internalServerError: IThrow['function']
      // Internal Server Error
      err_notImplemented: IThrow['function']
      // Not Implemented
      err_badGateway: IThrow['function']
      // Bad Gateway
      err_serviceUnavailable: IThrow['function']
      // Service Unavailable
      err_gatewayTimeout: IThrow['function']
      // Gateway Timeout
      err_httpVersionNotSupported: IThrow['function']
      // HTTP Version Not Supported
      err_insufficientStorage: IThrow['function']
      // Insufficient Storage
      err_networkAuthenticationRequired: IThrow['function']
      // Network Authentication Required
    }
  }
}

const throwlhos = (request: Request, response: Response, next: NextFunction) => {
  for(const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
    if(!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1','2'].includes(String(httpCode).charAt(0))) {
      (response as any)['err_' + camelCase(httpStatus)] = function (message?: string | null, errors?: any): IThrowlhos {
        return {
          code: httpCode,
          status: httpStatus,
          message: message ?? HttpStatus.getStatusText(String(httpCode)),
          errors: errors,
        } as IThrowlhos
      }
    }
  }
  next()
}


export default throwlhos
