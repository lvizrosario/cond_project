import { Controller, Get, Injectable, Module, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { Policy } from '../common/decorators/policy.decorator'

@Injectable()
class FilesService {
  getDownloadUrl(documentId: string) {
    return { documentId, adapter: 'local-disk', path: `storage/${documentId}.pdf` }
  }
}

@Controller('files')
@UseGuards(AuthGuard, PolicyGuard)
class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':documentId')
  @Policy('authenticated')
  getDownloadUrl(@Param('documentId') documentId: string) {
    return this.filesService.getDownloadUrl(documentId)
  }
}

@Module({
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
