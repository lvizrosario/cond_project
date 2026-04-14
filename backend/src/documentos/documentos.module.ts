import { Body, Controller, Get, Injectable, Module, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class DocumentosService {
  constructor(private readonly db: MockDatabaseService) {}

  list() {
    return this.db.documentos.map((documento) => ({
      ...documento,
      versoes: this.db.documentoVersions.filter((version) => version.documentoId === documento.id),
      ultimaVersao: this.db.documentoVersions.filter((version) => version.documentoId === documento.id).sort((a, b) => b.versao - a.versao)[0],
    }))
  }

  create(body: Record<string, unknown>) {
    const documento = { id: `d${this.db.documentos.length + 1}`, tenantId: 'cond-1', titulo: body.titulo, categoria: body.categoria, audience: body.audience, arquivado: false, atualizadoEm: new Date().toISOString(), descricao: body.descricao }
    this.db.documentos.unshift(documento)
    this.db.documentoVersions.unshift({ id: `dv${this.db.documentoVersions.length + 10}`, documentoId: documento.id, versao: 1, arquivoNome: body.arquivoNome, criadoPorNome: 'Fernanda Rocha', criadoEm: new Date().toISOString() })
    return (this.list() as Array<Record<string, any>>).find((item) => item.id === documento.id)
  }

  addVersion(id: string, body: Record<string, unknown>) {
    const current = this.db.documentoVersions.filter((item) => item.documentoId === id).sort((a, b) => b.versao - a.versao)[0]
    const version = { id: `dv${this.db.documentoVersions.length + 10}`, documentoId: id, versao: current ? current.versao + 1 : 1, arquivoNome: body.arquivoNome, criadoPorNome: 'Carlos Eduardo Lima', criadoEm: new Date().toISOString() }
    this.db.documentoVersions.unshift(version)
    return version
  }

  archive(id: string) {
    const documento = this.db.documentos.find((item) => item.id === id)
    if (!documento) return null
    documento.arquivado = true
    return documento
  }

  download(id: string) {
    return { documentId: id, downloadUrl: `/files/${id}` }
  }
}

@Controller('documentos')
@UseGuards(AuthGuard, PolicyGuard)
class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Get()
  @Policy('authenticated')
  list() {
    return this.documentosService.list()
  }

  @Post()
  @Policy('admin')
  create(@Body() body: Record<string, unknown>) {
    return this.documentosService.create(body)
  }

  @Post(':id/versions')
  @Policy('admin')
  addVersion(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.documentosService.addVersion(id, body)
  }

  @Get(':id/download')
  @Policy('authenticated')
  download(@Param('id') id: string) {
    return this.documentosService.download(id)
  }

  @Patch(':id/archive')
  @Policy('admin')
  archive(@Param('id') id: string) {
    return this.documentosService.archive(id)
  }
}

@Module({
  controllers: [DocumentosController],
  providers: [DocumentosService],
})
export class DocumentosModule {}
