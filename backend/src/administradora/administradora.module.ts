import { Body, Controller, Get, Injectable, Module, Patch, Post, UseGuards } from '@nestjs/common'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class AdministradoraService {
  constructor(private readonly db: MockDatabaseService) {}

  getProfile() {
    return this.db.administradora
  }

  updateProfile(body: Record<string, unknown>) {
    this.db.administradora = { ...this.db.administradora, ...body }
    return this.db.administradora
  }

  addContact(body: Record<string, unknown>) {
    const contact = { id: `ac${this.db.administradora.contatos.length + 1}`, ...body }
    this.db.administradora.contatos.unshift(contact)
    return contact
  }

  addContract(body: Record<string, unknown>) {
    const contract = { id: `ct${this.db.administradora.contratos.length + 1}`, ...body }
    this.db.administradora.contratos.unshift(contract)
    return contract
  }
}

@Controller('administradora')
@UseGuards(AuthGuard, PolicyGuard)
class AdministradoraController {
  constructor(private readonly administradoraService: AdministradoraService) {}

  @Get()
  @Policy('authenticated')
  getProfile() {
    return this.administradoraService.getProfile()
  }

  @Patch()
  @Policy('admin')
  updateProfile(@Body() body: Record<string, unknown>) {
    return this.administradoraService.updateProfile(body)
  }

  @Post('contacts')
  @Policy('admin')
  addContact(@Body() body: Record<string, unknown>) {
    return this.administradoraService.addContact(body)
  }

  @Post('contracts')
  @Policy('admin')
  addContract(@Body() body: Record<string, unknown>) {
    return this.administradoraService.addContract(body)
  }
}

@Module({
  controllers: [AdministradoraController],
  providers: [AdministradoraService],
})
export class AdministradoraModule {}
