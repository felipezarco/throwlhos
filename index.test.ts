
import express, { NextFunction, Response, Request } from 'express'
import throwlhos, { IThrowlhos } from './index'
import errorHandler from 'responserror'
import request from 'supertest'
import responser from 'responser'

const i18nKeys: Record<string, string> = {
  'error.custom': 'This is a custom error! - I was translated'
}

const translationMiddleware = (error: any, _request: Request, _response: Response, next: NextFunction): void => {
  if(error.i18n) {
    error.message = i18nKeys[error.i18n.key]
    delete error.i18n
  }
  next(error)
}

test('it returns correctly formated object (object)', async () => {
  const notFoundThrowlhos: IThrowlhos = throwlhos.err_notFound('Sorry, something is missing!', {
    tryToFind: 'whereIHaveBeen'
  })
  expect(notFoundThrowlhos).toEqual({
    message: 'Sorry, something is missing!',
    code: 404,
    status: 'NOT_FOUND',
    errors: {
      tryToFind: 'whereIHaveBeen'
    }
  })
})

test('it accepts no parameters call', async () => {
  const notFoundThrowlhos: IThrowlhos = throwlhos.err_notFound()
  expect(notFoundThrowlhos).toEqual({
    message: 'Not Found',
    code: 404,
    status: 'NOT_FOUND'
  })
})

test('it accepts null message with content', async () => {
  const notFoundThrowlhos: IThrowlhos = throwlhos.err_notFound(null, ['HardToReadException'])
  expect(notFoundThrowlhos).toEqual({
    message: 'Not Found',
    code: 404,
    status: 'NOT_FOUND',
    errors: ['HardToReadException']
  })
})

test('it returns correctly formated object (middleware)', async () => {
  const app = express()
  app.use(throwlhos.middleware)
  app.use(responser)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    const notFoundThrowlhos: IThrowlhos = response.err_notFound('Sorry, something is missing!', {
      tryToFind: 'whereIHaveBeen'
    })
    return response.send(notFoundThrowlhos)
  })
  app.use(router)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    message: 'Sorry, something is missing!',
    code: 404,
    status: 'NOT_FOUND',
    errors: {
      tryToFind: 'whereIHaveBeen'
    }
  })
})

test('it returns correctly when no params are given', async () => {
  const app = express()
  app.use(throwlhos.middleware)
  app.use(responser)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    const internalServerErrorThrowlhos: IThrowlhos = response.err_internalServerError()
    return response.send(internalServerErrorThrowlhos)
  })
  app.use(router)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 500,
    status: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error'
  })
})

test('it throws correctly with responserror handler', async () => {
  const app = express()
  app.use(throwlhos.middleware)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      throw response.err_forbidden('Acesso negado!', { access: false})
    } catch(err) {
      return next(err)
    }
  })
  /* @ts-ignore */
  app.use(router, errorHandler)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 403,
    status: 'FORBIDDEN',
    message: 'Acesso negado!',
    errors: {
      access: false
    },
    success: false
  })
})

test('it throws correctly with responser and responserror handler', async () => {
  const app = express()
  app.use(responser)
  app.use(throwlhos.middleware)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      throw response.err_forbidden('Acesso negado!', { access: false})
    } catch(err) {
      return next(err)
    }
  })
  /* @ts-ignore */
  app.use(router, errorHandler)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 403,
    status: 'FORBIDDEN',
    message: 'Acesso negado!',
    errors: {
      access: false
    },
    success: false
  })
})

test('it throws correctly with responser and responserror handler without errors', async () => {
  const app = express()
  app.use(responser)
  app.use(throwlhos.middleware)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      throw response.err_forbidden('Acesso negado!!')
    } catch(err) {
      return next(err)
    }
  })
  /* @ts-ignore */
  app.use(router, errorHandler)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 403,
    status: 'FORBIDDEN',
    message: 'Acesso negado!!',
    success: false
  })
})

test('it can throw custom errors', async () => {
  const app = express()
  app.use(responser)
  app.use(throwlhos.middleware)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      const randomObject = { fruit: 'banana' }
      throw response.err_custom('This is a custom error!', 500, randomObject)
    } catch(err) {
      return next(err)
    }
  })
  /* @ts-ignore */
  app.use(router, errorHandler)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 500,
    status: 'CUSTOM_ERROR',
    message: 'This is a custom error!',
    success: false,
    errors: {
      fruit: 'banana'
    }
  })
})

test('it accepts i18n object without i18n.options', async () => {
  const notFoundThrowlhos: IThrowlhos = throwlhos.err_notFound('Not Found', undefined, { key: 'error.not_found' })
  expect(notFoundThrowlhos).toEqual({
    message: 'Not Found',
    code: 404,
    status: 'NOT_FOUND',
    i18n: { key: 'error.not_found' }
  })
})

test('it accepts i18n object with i18n.options', async () => {
  const notFoundThrowlhos: IThrowlhos = throwlhos.err_notFound('Not Found', { }, { key: 'error.not_found', options: { resource: 'item' } })
  expect(notFoundThrowlhos).toEqual({
    message: 'Not Found',
    code: 404,
    status: 'NOT_FOUND',
    i18n: { key: 'error.not_found', options: { resource: 'item' } }
  })
})

test('it can throw errors with i18n object in output', async () => {
  const app = express()
  app.use(responser)
  app.use(throwlhos.middleware)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      const randomObject = { fruit: 'banana' }
      throw response.err_badRequest('This is a bad request with i18n!', randomObject, { key: 'error.badRequest', options: { item: 'banana' } })
    } catch(err) {
      return next(err)
    }
  })
 
  /* @ts-ignore */
  app.use(router, errorHandler)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 400,
    status: 'BAD_REQUEST',
    message: 'This is a bad request with i18n!',
    success: false,
    errors: {
      fruit: 'banana'
    },
    i18n: { key: 'error.badRequest', options: { item: 'banana' } }
  })
})

test('it can throw custom errors with i18n object in output', async () => {
  const app = express()
  app.use(responser)
  app.use(throwlhos.middleware)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      const randomObject = { fruit: 'banana' }
      throw response.err_custom('This is a custom error with i18n!', 500, randomObject, { key: 'error.custom', options: { item: 'banana' } })
    } catch(err) {
      return next(err)
    }
  })
 
  /* @ts-ignore */
  app.use(router, errorHandler)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 500,
    status: 'CUSTOM_ERROR',
    message: 'This is a custom error with i18n!',
    success: false,
    errors: {
      fruit: 'banana'
    },
    i18n: { key: 'error.custom', options: { item: 'banana' } }
  })
})

test('it can be used with a translator middleware for override message', async () => {
  const app = express()
  app.use(responser)
  app.use(throwlhos.middleware)
  const router = express.Router()
  router.post('/resources', (_, response: Response, next: NextFunction) => {
    try {
      const randomObject = { fruit: 'banana' }
      throw response.err_custom('This is a custom error!', 500, randomObject, { key: 'error.custom' })
    } catch(err) {
      return next(err)
    }
  })
  
  // Simulating a translation middleware that overrides the message based on i18n object
  app.use(router, translationMiddleware)
  app.use(router, errorHandler)
  const response = await request(app).post('/resources')
  expect(response.body).toEqual({
    code: 500,
    status: 'CUSTOM_ERROR',
    message: 'This is a custom error! - I was translated',
    success: false,
    errors: {
      fruit: 'banana'
    }
  })
})