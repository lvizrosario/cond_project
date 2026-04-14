import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Backend foundation (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('logs in with seeded credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'fernanda@email.com', senha: 'Teste@123' })
      .expect(201)
  })

  it('creates a pending reservation and allows admin approval', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/reservas')
      .set('Authorization', 'Bearer seed-token-4')
      .set('X-Condominio-ID', 'cond-1')
      .send({
        area: 'quadra',
        dataInicio: '2026-04-23T18:00:00Z',
        dataFim: '2026-04-23T20:00:00Z',
        observacoes: 'Treino da noite',
      })
      .expect(201)

    expect(created.body.status).toBe('pendente')

    const approved = await request(app.getHttpServer())
      .post(`/api/reservas/${created.body.id}/approve`)
      .set('Authorization', 'Bearer seed-token-2')
      .set('X-Condominio-ID', 'cond-1')
      .expect(201)

    expect(approved.body.status).toBe('confirmada')
    expect(approved.body.aprovadoPorId).toBeDefined()
  })

  it('blocks churrasqueira and salao on the same day', async () => {
    await request(app.getHttpServer())
      .post('/api/reservas')
      .set('Authorization', 'Bearer seed-token-4')
      .set('X-Condominio-ID', 'cond-1')
      .send({
        area: 'salao_festas',
        dataInicio: '2026-04-25T15:00:00Z',
        dataFim: '2026-04-25T20:00:00Z',
      })
      .expect(201)

    await request(app.getHttpServer())
      .post('/api/reservas')
      .set('Authorization', 'Bearer seed-token-4')
      .set('X-Condominio-ID', 'cond-1')
      .send({
        area: 'churrasqueira',
        dataInicio: '2026-04-25T10:00:00Z',
        dataFim: '2026-04-25T14:00:00Z',
      })
      .expect(400)
  })
})
