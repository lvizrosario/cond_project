import { Body, Controller, Get, Injectable, Module, Post, Query } from '@nestjs/common'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class AuthService {
  constructor(private readonly db: MockDatabaseService) {}

  login(email: string, senha: string) {
    const user = this.db.users.find((item) => item.email === email)
    if (!user || senha !== 'Teste@123') {
      return { message: 'Invalid credentials', statusCode: 401 }
    }
    return {
      token: `seed-token-${user.id}`,
      refreshToken: `seed-refresh-${user.id}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
      user: {
        id: user.id,
        nomeCompleto: user.nomeCompleto,
        email: user.email,
        roles: { primary: user.primaryRole, isMorador: user.isMorador },
        condominio: { id: user.tenantId, nome: 'Residencial das Acacias', cep: '70000-000', quadra: 'A', numero: '10' },
      },
    }
  }

  register(body: Record<string, unknown>) {
    return { message: 'Cadastro recebido', email: body.email }
  }
}

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; senha: string }) {
    return this.authService.login(body.email, body.senha)
  }

  @Post('register')
  register(@Body() body: Record<string, unknown>) {
    return this.authService.register(body)
  }

  @Get('confirm')
  confirm(@Query('token') token: string) {
    return { message: token ? 'E-mail confirmado com sucesso.' : 'Token inválido ou expirado.' }
  }
}

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
