
import express, { NextFunction, Request, response, Response } from 'express'
import throwlhos, { IThrowlhos } from './index'
import errorHandler from 'responserror'
import request from 'supertest'
import responser from 'responser'

test('it returns correctly formated object', async () => {
  const app = express()
  app.use(throwlhos)
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
  app.use(throwlhos)
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
  app.use(throwlhos)
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
  app.use(throwlhos)
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
  app.use(throwlhos)
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
