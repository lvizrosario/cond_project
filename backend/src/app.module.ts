import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { TenantsModule } from './tenants/tenants.module'
import { UsersModule } from './users/users.module'
import { PermissionsModule } from './permissions/permissions.module'
import { NotificationsModule } from './notifications/notifications.module'
import { FilesModule } from './files/files.module'
import { AvisosModule } from './avisos/avisos.module'
import { CorrespondenciasModule } from './correspondencias/correspondencias.module'
import { DocumentosModule } from './documentos/documentos.module'
import { ReservasModule } from './reservas/reservas.module'
import { ReunioesModule } from './reunioes/reunioes.module'
import { AdministradoraModule } from './administradora/administradora.module'
import { ConfiguracoesModule } from './configuracoes/configuracoes.module'
import { DatabaseModule } from './config/database.module'

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    PermissionsModule,
    NotificationsModule,
    FilesModule,
    AvisosModule,
    CorrespondenciasModule,
    DocumentosModule,
    ReservasModule,
    ReunioesModule,
    AdministradoraModule,
    ConfiguracoesModule,
  ],
})
export class AppModule {}
