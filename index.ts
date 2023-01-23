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

type ICustomThrow = {
  function(message: string, code: number, errors?: any): IThrowlhos
}

interface IThrolhosImportObject {
  middleware: (request: Request, response: Response, next: NextFunction) => void
  err_multipleChoices: IThrow['function']
  err_movedPermanently: IThrow['function']
  err_movedTemporarily: IThrow['function']
  err_seeOther: IThrow['function']
  err_notModified: IThrow['function']
  err_useProxy: IThrow['function']
  err_temporaryRedirect: IThrow['function']
  err_permanentRedirect: IThrow['function']
  err_badRequest: IThrow['function']
  err_unauthorized: IThrow['function']
  err_paymentRequired: IThrow['function']
  err_forbidden: IThrow['function']
  err_notFound: IThrow['function']
  err_methodNotAllowed: IThrow['function']
  err_notAcceptable: IThrow['function']
  err_proxyAuthenticationRequired: IThrow['function']
  err_requestTimeout: IThrow['function']
  err_conflict: IThrow['function']
  err_gone: IThrow['function']
  err_lengthRequired: IThrow['function']
  err_preconditionFailed: IThrow['function']
  err_requestTooLong: IThrow['function']
  err_requestUriTooLong: IThrow['function']
  err_unsupportedMediaType: IThrow['function']
  err_requestedRangeNotSatisfiable: IThrow['function']
  err_expectationFailed: IThrow['function']
  err_imATeapot: IThrow['function']
  err_insufficientSpaceOnResource: IThrow['function']
  err_methodFailure: IThrow['function']
  err_misdirectedRequest: IThrow['function']
  err_unprocessableEntity: IThrow['function']
  err_locked: IThrow['function']
  err_failedDependency: IThrow['function']
  err_preconditionRequired: IThrow['function']
  err_tooManyRequests: IThrow['function']
  err_requestHeaderFieldsTooLarge: IThrow['function']
  err_unavailableForLegalReasons: IThrow['function']
  err_internalServerError: IThrow['function']
  err_notImplemented: IThrow['function']
  err_badGateway: IThrow['function']
  err_serviceUnavailable: IThrow['function']
  err_gatewayTimeout: IThrow['function']
  err_httpVersionNotSupported: IThrow['function']
  err_insufficientStorage: IThrow['function']
  err_networkAuthenticationRequired: IThrow['function']
  err_custom: ICustomThrow['function']
}
  

declare global {
  namespace Express {
    interface Response {
      err_multipleChoices: IThrow['function']
      err_movedPermanently: IThrow['function']
      err_movedTemporarily: IThrow['function']
      err_seeOther: IThrow['function']
      err_notModified: IThrow['function']
      err_useProxy: IThrow['function']
      err_temporaryRedirect: IThrow['function']
      err_permanentRedirect: IThrow['function']
      err_badRequest: IThrow['function']
      err_unauthorized: IThrow['function']
      err_paymentRequired: IThrow['function']
      err_forbidden: IThrow['function']
      err_notFound: IThrow['function']
      err_methodNotAllowed: IThrow['function']
      err_notAcceptable: IThrow['function']
      err_proxyAuthenticationRequired: IThrow['function']
      err_requestTimeout: IThrow['function']
      err_conflict: IThrow['function']
      err_gone: IThrow['function']
      err_lengthRequired: IThrow['function']
      err_preconditionFailed: IThrow['function']
      err_requestTooLong: IThrow['function']
      err_requestUriTooLong: IThrow['function']
      err_unsupportedMediaType: IThrow['function']
      err_requestedRangeNotSatisfiable: IThrow['function']
      err_expectationFailed: IThrow['function']
      err_imATeapot: IThrow['function']
      err_insufficientSpaceOnResource: IThrow['function']
      err_methodFailure: IThrow['function']
      err_misdirectedRequest: IThrow['function']
      err_unprocessableEntity: IThrow['function']
      err_locked: IThrow['function']
      err_failedDependency: IThrow['function']
      err_preconditionRequired: IThrow['function']
      err_tooManyRequests: IThrow['function']
      err_requestHeaderFieldsTooLarge: IThrow['function']
      err_unavailableForLegalReasons: IThrow['function']
      err_internalServerError: IThrow['function']
      err_notImplemented: IThrow['function']
      err_badGateway: IThrow['function']
      err_serviceUnavailable: IThrow['function']
      err_gatewayTimeout: IThrow['function']
      err_httpVersionNotSupported: IThrow['function']
      err_insufficientStorage: IThrow['function']
      err_networkAuthenticationRequired: IThrow['function']
      err_custom: ICustomThrow['function']
    }
  }
}

const addThrowlhosToObject = function(object: any) {
  for(const [httpStatus, httpCode] of Object.entries(HttpStatus)) {
    if(!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1','2'].includes(String(httpCode).charAt(0))) {
      (object as any)['err_' + camelCase(httpStatus)] = function (message?: string | null, errors?: any): IThrowlhos {
        return {
          code: httpCode,
          status: httpStatus,
          message: message ?? HttpStatus.getStatusText(String(httpCode)),
          errors: errors,
        } as IThrowlhos
      }
    }
  }
  (object as any)['err_custom'] = function (message: string, code: number, errors?: any): IThrowlhos {
    return {
      message: message,
      code: code,
      status: 'CUSTOM_ERROR',
      errors: errors,
    } as IThrowlhos
  }
}

const throwlhos = {
  middleware: (request: Request, response: Response, next: NextFunction) => {
    addThrowlhosToObject(response)
    next()
  }
}

addThrowlhosToObject(throwlhos)

export default throwlhos as IThrolhosImportObject
