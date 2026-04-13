import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { UserRoleTable } from './components/UserRoleTable'
import { RolePermissionMatrix } from './components/RolePermissionMatrix'

export function AcessosPage() {
  return (
    <div>
      <PageHeader title="Acessos" description="Gerencie perfis e permissões dos moradores" />
      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
        </TabsList>
        <TabsContent value="usuarios">
          <UserRoleTable />
        </TabsContent>
        <TabsContent value="permissoes">
          <RolePermissionMatrix />
        </TabsContent>
      </Tabs>
    </div>
  )
}
