
import express, { NextFunction, Response } from 'express'
import throwlhos, { IThrowlhos } from './index'
import errorHandler from 'responserror'
import request from 'supertest'
import responser from 'responser'

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
