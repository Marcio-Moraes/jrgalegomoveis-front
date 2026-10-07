# JR Galego Móveis

Front-end estático de uma loja virtual de móveis e decoração. O projeto apresenta a marca JR Galego Móveis, vitrines de produtos, navegação por ambientes e categorias, catálogo com filtros, página de detalhes, carrinho demonstrativo e contato pelo WhatsApp.

Foi desenvolvido com HTML semântico, CSS e JavaScript vanilla para validar a experiência visual e de compra no navegador e servir de ponto de partida para um futuro tema WordPress integrado ao WooCommerce. Não é ainda uma loja conectada a pagamentos, estoque, frete ou pedidos reais.

## Índice

- [Visão geral](#visão-geral)
- [Como o projeto foi criado](#como-o-projeto-foi-criado)
- [Tecnologias, bibliotecas e serviços](#tecnologias-bibliotecas-e-serviços)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Páginas e seções](#páginas-e-seções)
- [Como executar](#como-executar)
- [Dados e funcionalidades demonstrativas](#dados-e-funcionalidades-demonstrativas)
- [Preparação para WordPress e WooCommerce](#preparação-para-wordpress-e-woocommerce)
- [Limites atuais e próximos passos](#limites-atuais-e-próximos-passos)

## Visão geral

O foco do projeto é apresentar uma experiência de compra de móveis clara, responsiva e comercial, valorizando:

- ambientes e produtos por categoria;
- ofertas, destaques e produtos mais vendidos;
- imagens e conteúdo editorial para inspirar a escolha;
- informações úteis sobre produtos;
- acesso rápido ao atendimento;
- navegação utilizável em desktop, tablet e celular.

A identidade visual usa tons neutros, marrom escuro e dourado, com a família tipográfica Inter. O conteúdo e os produtos são dados fictícios para demonstração.

## Como o projeto foi criado

1. A arquitetura das páginas e a experiência da loja foram definidas a partir do briefing em [`docs/plan.md`](docs/plan.md).
2. A interface foi organizada em três documentos HTML independentes: página inicial, catálogo/categoria e produto.
3. Os estilos foram separados por responsabilidade e reunidos por um CSS principal.
4. O catálogo foi colocado em um arquivo JavaScript independente; outro script cria os cards e gerencia as interações da interface.
5. Imagens de ambientes e produtos foram referenciadas externamente para compor a demonstração.
6. A marcação foi estruturada para que os blocos visuais e os dados tenham correspondência com templates e entidades do WooCommerce.

Não há etapa de compilação ou empacotamento: o navegador carrega diretamente os arquivos HTML, CSS e JavaScript.

## Tecnologias, bibliotecas e serviços

### Tecnologias principais

- **HTML5:** páginas, conteúdo semântico, formulários, navegação e atributos `data-*` usados como pontos de integração do JavaScript.
- **CSS3:** identidade visual, layout com CSS Grid e Flexbox, componentes, estados de interação, animações de transição e breakpoints responsivos.
- **JavaScript vanilla (ES6+):** catálogo mockado, criação de vitrines, filtros, ordenação, paginação, produto, carrinho, favoritos e feedbacks.

### Bibliotecas e recursos externos

- **Inter**, servida pelo Google Fonts, para a tipografia da interface.
- **Lucide**, carregada por CDN (`unpkg`), para os ícones declarados com `data-lucide`.
- **Unsplash**, para fotografias de ambientes e móveis.
- **Schema.org em JSON-LD**, para dados estruturados de organização, loja, site, produto, oferta e breadcrumb.
- **APIs nativas do navegador:** `localStorage` e `sessionStorage` para persistência local, `Intl.NumberFormat` para formatação de preços e `URLSearchParams` para leitura dos parâmetros de página.

Não são usados React, Vue, Angular, Zustand, bibliotecas de componentes, bibliotecas de animação ou dependências instaladas por npm. Apesar de o briefing inicial mencionar Zustand para o carrinho, a implementação existente é em JavaScript vanilla com persistência local.

## Estrutura de arquivos

```text
jrgalegomoveis/
├── index.html
├── categoria.html
├── produto.html
├── README.md
├── docs/
│   └── plan.md
└── assets/
    ├── css/
    │   ├── style.css
    │   ├── base.css
    │   ├── components.css
    │   ├── pages.css
    │   └── responsive.css
    ├── imgs/
    │   └── .gitkeep
    └── js/
        ├── products.js
        └── app.js
```

### CSS: arquivos de estilização

- [`assets/css/style.css`](assets/css/style.css): ponto de entrada dos estilos; importa `base.css`, `components.css`, `pages.css` e `responsive.css`, nesta ordem. Os parâmetros de versão nas importações ajudam a invalidar cache do navegador.
- [`assets/css/base.css`](assets/css/base.css): variáveis da identidade visual, regras globais, tipografia, container, cabeçalho, navegação, botões, links, foco e estados básicos.
- [`assets/css/components.css`](assets/css/components.css): aparência dos componentes compartilhados e das seções da Home, incluindo hero, cards de ambientes e produtos, benefícios, inspiração, newsletter, footer, notificações e drawers.
- [`assets/css/pages.css`](assets/css/pages.css): estilos específicos do catálogo, filtros, ordenação, paginação, breadcrumb e detalhes do produto.
- [`assets/css/responsive.css`](assets/css/responsive.css): ajustes para telas menores, adaptação do menu e dos filtros em drawers, grids móveis e larguras compactas.

### JavaScript: arquivos de script

- [`assets/js/products.js`](assets/js/products.js): fonte dos dados de demonstração. Expõe `window.JRProducts`, com 20 produtos e campos como identificador, nome, categoria, preço, parcelamento, avaliação, imagem, estoque, descrição e destaque. Completa marca, cor e material com base na categoria.
- [`assets/js/app.js`](assets/js/app.js): comportamento da loja. Cria cards e vitrines, renderiza a página do produto, filtra e ordena o catálogo, controla paginação, busca, menu, mega menu, galeria, variações, quantidade, carrinho, favoritos, newsletter, toasts, rolagem preservada entre páginas e JSON-LD.
- [`assets/imgs/`](assets/imgs/): pasta reservada para imagens locais da marca e do catálogo. No estado atual, contém apenas `.gitkeep`; as fotografias vêm do Unsplash.

## Páginas e seções

### Página inicial — `index.html`

Apresenta a loja e conduz o visitante da inspiração à consulta dos produtos:

1. **Top bar:** avisos de ofertas, pagamento facilitado e atendimento pelo WhatsApp.
2. **Header:** marca, busca, conta, favoritos e carrinho; o botão hamburger abre uma gaveta lateral.
3. **Navegação principal:** no desktop, os links para Início, Móveis, ambientes, Ofertas e Contato permanecem visíveis na faixa abaixo do cabeçalho, enquanto o hamburger abre uma gaveta lateral independente. No mobile, a faixa é ocultada e a gaveta continua disponível. O item Móveis expande um mega menu com ambientes e categorias procuradas.
4. **Hero:** fotografia de ambiente residencial, mensagem principal, botão para as ofertas e link para o WhatsApp.
5. **Ambientes:** cards para sala de estar, sala de jantar, quarto, cozinha, escritório e área externa.
6. **Categorias de móveis:** faixa rolável de categorias, como Sofás, Racks, Painéis, Mesas, Cadeiras, Camas, Armários e Poltronas.
7. **Ofertas da semana:** vitrine de produtos com preço anterior, desconto, preço atual e parcelamento.
8. **Banner editorial:** seção “Sua casa. Seu estilo.”, com chamada para conhecer os produtos.
9. **Produtos em destaque:** vitrine selecionada do catálogo.
10. **Diferenciais:** entrega, pagamento facilitado, compra segura, atendimento, seleção de produtos e variedade.
11. **Inspiração:** cards de ambientes ligados às categorias correspondentes.
12. **Mais vendidos:** lista horizontal com controles para rolar os produtos.
13. **Instagram:** grade de seis imagens e chamada para o perfil `@jrgallegomoveis`.
14. **Newsletter:** formulário demonstrativo com nome, e-mail e WhatsApp.
15. **Footer:** marca, links institucionais, categorias, atendimento e redes sociais.
16. **Carrinho drawer e WhatsApp flutuante:** componentes de acesso rápido compartilhados com as outras páginas.

### Catálogo e categoria — `categoria.html`

Oferece a navegação pelo catálogo de móveis:

- breadcrumb, título e descrição dinâmicos conforme a categoria ou os parâmetros da URL;
- busca recebida pelo parâmetro `q` e filtro de ofertas pelo parâmetro `ofertas=1`;
- filtros por categoria, preço, disponibilidade, marca, cor e material;
- ordenação por relevância, preço crescente, preço decrescente ou nome;
- grade de produtos com contador de resultados e paginação de nove itens;
- drawer de filtros em telas pequenas e estado de resultados vazios.

Os links de categoria usam URLs de demonstração, por exemplo `categoria.html?categoria=Sofás`.

### Detalhe do produto — `produto.html`

Apresenta um produto carregado a partir do parâmetro `id` da URL, por exemplo `produto.html?id=sofa-linho`:

- breadcrumb e galeria com miniaturas;
- nome, referência, avaliação, descrição, preço, desconto e parcelamento;
- seleção demonstrativa de cor e controle de quantidade;
- botão para adicionar ao carrinho e acesso ao WhatsApp;
- informações de entrega e pagamento;
- abas/âncoras de descrição, características, entrega e avaliações;
- vitrine de produtos relacionados;
- JSON-LD de produto, oferta e `BreadcrumbList`, preenchido com dados mockados.

### Componentes compartilhados

O header, a navegação, o rodapé, o carrinho lateral, notificações e o botão flutuante de WhatsApp seguem o mesmo padrão nas três páginas para facilitar a extração futura em partes reutilizáveis de tema.

## Como executar

O projeto é estático e não precisa de instalação de dependências. Recomenda-se servir os arquivos por HTTP local para evitar restrições do navegador ao abrir páginas diretamente pelo sistema de arquivos.

### Windows com Python

No PowerShell, a partir da pasta `jrgalegomoveis`:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000/` no navegador. Para interromper o servidor, use `Ctrl+C`.

### Windows com Node.js

Se preferir usar Node.js e tiver o pacote disponível:

```powershell
npx serve .
```

Abra o endereço local indicado no terminal. Não existe um script `npm run` configurado neste projeto.

## Dados e funcionalidades demonstrativas

- Os 20 produtos estão em `window.JRProducts`; os grupos “ofertas”, “destaques”, “mais vendidos” e “relacionados” são derivados dessa lista por sinalizadores e atributos.
- Os cards são montados em JavaScript a partir dos dados, em vez de manter cópias manuais de cada produto em cada vitrine.
- O catálogo aplica filtros e ordenação no navegador e divide os resultados em páginas de nove itens.
- O carrinho e os favoritos são guardados no `localStorage` do navegador com as chaves `jr-galego-cart` e `jr-galego-favorites`.
- O último ponto de rolagem antes de algumas navegações é guardado temporariamente em `sessionStorage`.
- Os preços são formatados em reais com `Intl.NumberFormat("pt-BR", ...)`.
- As imagens, a fonte e os ícones dependem de serviços externos e de conexão com a internet.

### O que ainda é apenas demonstração

- **Checkout:** não cria pedidos nem realiza pagamento; mostra uma mensagem informando que a finalização será conectada ao WooCommerce.
- **Frete e entrega:** não há consulta real de CEP, transportadora, região ou prazo.
- **Newsletter:** o envio é interceptado no navegador e apresenta confirmação visual; não salva nem envia o cadastro a um serviço.
- **Conta e avaliações:** não há autenticação de cliente nem sistema de avaliações conectado.
- **WhatsApp:** os links usam atualmente `5500000000000` como número provisório. Substitua-o pelo telefone oficial antes de publicar.
- **Produtos, preços, estoque, avaliações e metadados:** são fictícios e não devem ser tratados como dados reais de venda.
- **Cores e materiais:** são atributos ilustrativos atribuídos pelo grupo de categoria em `products.js`, não variações reais específicas de cada item.

## Preparação para WordPress e WooCommerce

A estrutura separa páginas, estilos, comportamento e catálogo mockado, permitindo substituir progressivamente os dados e o shell estático pelos recursos do WordPress. A integração de tema e WooCommerce ainda não foi implementada.

### Mapeamento recomendado para o tema

| Estrutura atual | Destino recomendado |
| --- | --- |
| `index.html` | `front-page.php`, com as seções da Home e chamadas a template parts |
| Header repetido nas páginas | `header.php` e partes para busca, navegação e mega menu |
| Footer repetido nas páginas | `footer.php` |
| Cards gerados por `productCard()` em `app.js` | template part de produto, por exemplo `template-parts/product-card.php` |
| `categoria.html` | `archive-product.php` ou `taxonomy-product_cat.php` |
| `produto.html` | `single-product.php` ou templates WooCommerce sobrescritos com parcimônia |
| `assets/css/` e `assets/js/` | arquivos versionados/enfileirados por `functions.php` com `wp_enqueue_style()` e `wp_enqueue_script()` |
| `products.js` | produtos cadastrados no WooCommerce, recuperados pelos loops e APIs do WordPress |
| filtros feitos em JavaScript | taxonomias, atributos e filtros do WooCommerce; manter JS para drawer e melhorias progressivas |
| carrinho no `localStorage` | carrinho de sessão do WooCommerce, mantendo a interface do drawer e conectando suas ações aos endpoints/hooks corretos |
| JSON-LD atual | dados estruturados e metadados gerados pelo WordPress/WooCommerce ou pelo plugin SEO escolhido, sem duplicidade |

### Melhor forma de aproveitar a estrutura

1. **Criar primeiro o tema e o shell compartilhado:** mover cabeçalho e rodapé para `header.php` e `footer.php`; registrar menus no WordPress e manter cada seção da Home em template part.
2. **Converter os templates visuais sem reescrever os estilos:** começar pelo catálogo e produto, substituindo o HTML demonstrativo pelos hooks e loops do WooCommerce. Preservar classes CSS quando a semântica permitir.
3. **Manter um único componente de card:** converter o card gerado em JavaScript para um template PHP reutilizável que receba o produto WooCommerce atual e apresente preço, preço promocional, estoque, imagem, link e botão reais.
4. **Migrar os produtos mockados para o painel:** cadastrar produtos, categorias, atributos globais e variações no WooCommerce. Preço, estoque, marca, material, cor, medidas e galeria devem vir desses dados, não de `products.js`.
5. **Trocar filtros demonstrativos por consultas reais:** usar as categorias, atributos e disponibilidade do catálogo; confirmar se cada filtro atual está ligado ao dado apropriado antes de ligar ao front-end.
6. **Conectar carrinho e checkout:** substituir as gravações em `localStorage` por operações de carrinho do WooCommerce e renderizar o subtotal/quantidades retornados pela loja.
7. **Integrar serviços operacionais:** configurar número real de WhatsApp, gateway de pagamento, cálculo de frete, newsletter e política de troca.
8. **Escolher uma única fonte de SEO estruturado:** remover ou adaptar o JSON-LD estático quando WooCommerce ou plugin SEO passar a gerar os schemas, evitando dados duplicados ou divergentes.
9. **Revisar desempenho e publicação:** hospedar imagens localmente ou em CDN otimizada, revisar licenças e disponibilidade dos ativos, configurar cache, URLs permanentes e testar todos os breakpoints e fluxos reais de compra.

### Cuidados de integração

- Usar as páginas HTML como referência visual, não como arquivos PHP a serem incluídos diretamente no WordPress.
- Enfileirar estilos e scripts pelo WordPress; não inserir os `<link>` e `<script>` atuais manualmente nos templates.
- Remover o cache-busting manual `?v=...` e aplicar versões definidas pelo tema, por exemplo com `filemtime()` no desenvolvimento.
- Tratar produtos e conteúdo como dados externos confiáveis do WooCommerce, escapando valores e URLs no PHP com as funções apropriadas.
- Substituir caminhos `.html` por links gerados pelas APIs do WordPress e pelas URLs permanentes dos produtos.
- Não manter `localStorage` como fonte de verdade do carrinho quando a loja estiver integrada.
- Confirmar que scripts e estilos carregam apenas nas páginas em que são necessários e que a navegação continua funcional sem JavaScript não essencial.

## Limites atuais e próximos passos

Este repositório é uma demonstração de interface, não uma instalação WordPress ou WooCommerce. Não inclui tema PHP, `functions.php`, banco de dados, API, checkout, gateway, gestão de produtos, imagens locais, pipeline de build ou testes automatizados configurados.

Antes de disponibilizar a loja ao público:

1. substituir produtos, preços, estoque e imagens de exemplo por conteúdo autorizado e real;
2. informar o WhatsApp, as políticas e as condições comerciais verdadeiras;
3. implementar e testar checkout, frete, pagamento, cadastro e privacidade;
4. converter e validar os templates no WordPress/WooCommerce, em desktop e mobile;
5. verificar SEO, acessibilidade, desempenho e comportamento em navegadores suportados.
