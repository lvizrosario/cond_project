###### **Funcionalidades MVP:**



Definiremos perfis para acesso ao dashboard, (Ex: Presidente Associação, Conselheiros, Síndico, Morador) sendo que o único perfil que pode ter duas categorias ao mesmo tempo é o morador.



**Regras de cargos de acesso a plataforma:**
Presidente: Pode ser morador, mas não pode ser síndico e/ou conselheiro ao mesmo tempo.

Conselheiro: Pode ser morador, mas não pode ser Presidente e/ou síndico ao mesmo tempo.

Síndico: Pode ser morador, mas não pode ser Presidente e/ou conselheiro ao mesmo tempo.

A partir dos cargos e privilégios de acessos que temos, já fica definido que para acessar a plataforma será necessário realizar um cadastro e posteriormente

login toda vez que for acessar a plataforma.

**Estrutura de login:**

O cadastro irá necessitar de nome completo e um endereço de e-mail válido.
Endereço do morador (CEP, Nome do Condomínio, Quadra e Número da casa), celular (DDD + celular).

Senha forte (Ao menos uma letra maíscula, números e caracter especial) de no mínimo 8 digitos.

O cadastro será confirmado através de um link de confirmação que será enviado ao e-mail informado pelo morador no cadastro realizado, somente a partir da confirmação ele terá acesso a plataforma.




**Com acesso a plataforma de administração o usuário terá acesso ao seguintes menus:**


* Acessos
* Administradora
* Avisos
* Configurações
* Correspondências
* Documentos
* Financeiro
* Início - Dashboard
* Reservas
* Reuniões





**Depois de criar esses menus no painel, começaremos a trabalhar uma funcionalidade por vez. 
Tendo como foco inicial nas seguintes funcionalidades:**

* Dashboard da tela de início com menu de informações rápidas, gráfico de receita do condomínio de acordo com o balanço que estará atrelado aos pagamentos realizados pelos moradores e demais informações que possam ser necessárias e tenham sentido com o design da tela inicial.
* Acessos (Definição de perfil, privilégios e menus que cada perfil pode acessar).
* Reservas das áreas do condomínio (Salão de festas, churrasqueira e quadra).
* Financeiro (Pagamento mensal do condomínio feito através de boleto).







