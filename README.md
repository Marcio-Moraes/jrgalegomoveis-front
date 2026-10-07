# JR Galego Móveis

Vitrine de e-commerce para uma loja de móveis, criada com HTML, CSS e JavaScript sem framework. O projeto demonstra a experiência de navegação e compra e organiza a interface para que ela possa servir de referência visual e estrutural para um futuro tema WordPress com WooCommerce.

> **Estado atual:** protótipo front-end estático e funcional para demonstração. Ainda não é um tema WordPress instalável e não realiza vendas, pagamentos, gestão de estoque ou cadastros em serviços externos.

## Índice

- [Objetivo e foco](#objetivo-e-foco)
- [Como o projeto foi criado](#como-o-projeto-foi-criado)
- [Tecnologias e recursos utilizados](#tecnologias-e-recursos-utilizados)
- [Estrutura de arquivos](#estrutura-de-arquivos)
- [Páginas e seções](#páginas-e-seções)
- [Como usar e executar](#como-usar-e-executar)
- [Comportamentos e dados de demonstração](#comportamentos-e-dados-de-demonstração)
- [Acessibilidade, SEO e desempenho](#acessibilidade-seo-e-desempenho)
- [Evolução para WordPress e WooCommerce](#evolução-para-wordpress-e-woocommerce)
- [Limitações e preparativos para publicação](#limitações-e-preparativos-para-publicação)

## Objetivo e foco

O objetivo é apresentar a JR Galego Móveis como uma loja acolhedora, confiável e comercial, destacando produtos e ambientes residenciais com uma identidade visual própria. A arquitetura de informação — navegação, organização do catálogo e apresentação das ofertas — foi inspirada por padrões comuns de lojas virtuais. Não foram reutilizados código ou elementos proprietários de outros sites.

As prioridades da interface são:

- Ajudar a encontrar produtos por ambiente, categoria ou busca.
- Dar visibilidade a preços promocionais, parcelamento e produtos em destaque.
- Facilitar o contato com a loja pelo WhatsApp.
- Oferecer uma experiência responsiva, com foco em celular e navegação por teclado.
- Manter dados, estilos e comportamento separados, facilitando a substituição dos exemplos por produtos e serviços reais.

## Como o projeto foi criado

O front-end foi construído com documentos HTML independentes para a página inicial, o catálogo e o detalhe de produto. As páginas compartilham a mesma estrutura visual de cabeçalho, navegação, rodapé e gaveta do carrinho. O CSS foi dividido por responsabilidade e reunido em um arquivo de entrada. Os registros de produtos mockados foram separados do JavaScript que controla a interface.

Essa divisão permite consultar o protótipo diretamente e também identificar os componentes que poderão ser transformados em templates, partes de template e funções de um tema WordPress.

## Tecnologias e recursos utilizados

### Base do projeto

- **HTML5:** estrutura das páginas, formulários, navegação, conteúdo e acessibilidade.
- **CSS3:** identidade visual, layouts com Flexbox e Grid, animações, estados de interação e breakpoints responsivos.
- **JavaScript moderno, sem framework:** renderização dos produtos demonstrativos, busca, filtros, paginação, carrinho, favoritos e interações das páginas.
- **`localStorage`:** persistência local do carrinho e dos favoritos neste navegador.
- **`Intl.NumberFormat`:** apresentação de valores na moeda brasileira (`BRL`).
- **JSON-LD / Schema.org:** dados estruturados para organização, loja, site, produto, oferta e breadcrumb.

### Serviços e recursos externos

- **Inter, do Google Fonts:** fonte tipográfica carregada pela internet.
- **Lucide:** biblioteca de ícones carregada pelo CDN oficial/unpkg.
- **Unsplash:** fotografias de ambientes e imagens ilustrativas dos produtos, carregadas remotamente.
- **WhatsApp:** links `wa.me` para iniciar conversas; o número presente no código ainda é demonstrativo.
- **Instagram:** links para o perfil informado e uma grade visual preparada para substituir as imagens de exemplo por publicações reais.

### O que não foi utilizado

- Não há dependências instaladas por npm, bundler ou etapa de compilação.
- Não há React, Vue, Zustand ou outro framework/gerenciador de estado. O plano menciona Zustand para o carrinho; nesta versão, o carrinho é implementado em JavaScript nativo e salvo no `localStorage`.
- Não há servidor, API, banco de dados, autenticação, pagamentos, integração WooCommerce ou serviço de newsletter conectado.
- Não há uma suíte de testes automatizados configurada no repositório.

## Estrutura de arquivos

```text
jrgalegomoveis/
├── README.md
├── index.html
├── categoria.html
├── produto.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   └── responsive.css
│   ├── imgs/
│   │   └── .gitkeep
│   └── js/
│       ├── app.js
│       └── products.js
└── docs/
    └── plan.md
```

### Páginas HTML

- [`index.html`](index.html): vitrine inicial, conteúdo comercial, navegação, links sociais e dados estruturados gerais.
- [`categoria.html`](categoria.html): catálogo com filtros, ordenação, paginação, drawer de filtros em telas pequenas e gaveta do carrinho.
- [`produto.html`](produto.html): estrutura do detalhe do produto, galeria, variações demonstrativas, informações, avaliações e produtos relacionados.

As páginas incluem marcação própria e carregam os mesmos recursos de CSS e JavaScript. Cabeçalho e rodapé estão repetidos nos documentos estáticos; na implementação WordPress, devem passar a ser componentes compartilhados do tema.

### CSS

[`assets/css/style.css`](assets/css/style.css) é a folha de entrada da interface. Importa as folhas menores na seguinte ordem:

1. [`assets/css/base.css`](assets/css/base.css): variáveis da paleta e tipografia, estilos gerais, cabeçalho, links, botões, containers e componentes básicos. Também define a abertura e a apresentação do mega menu.
2. [`assets/css/components.css`](assets/css/components.css): hero, cards de ambiente, categorias, cards de produtos, benefícios, inspiração, Instagram, newsletter, rodapé, gaveta do carrinho e botão flutuante do WhatsApp.
3. [`assets/css/pages.css`](assets/css/pages.css): estilos específicos do catálogo, painel de filtros, paginação, detalhe do produto, galeria e abas de informação.
4. [`assets/css/responsive.css`](assets/css/responsive.css): adaptações para larguras menores ou iguais a 1050 px, 760 px e 380 px; inclui navegação mobile, grades com duas colunas, gavetas e ajustes de tipografia e espaçamento.

A pasta `assets/imgs/` está preparada para receber arquivos de imagem locais. Atualmente, o `.gitkeep` apenas conserva a pasta no projeto; as imagens visíveis vêm de URLs externas do Unsplash.

### JavaScript

- [`assets/js/products.js`](assets/js/products.js): disponibiliza `window.JRProducts`, uma lista de 20 produtos demonstrativos distribuídos em nove categorias. Cada registro contém dados usados pela interface, como nome, preço, preço anterior, parcelamento, avaliação, categoria, identificador de imagem e descrição. Atributos de marca, cor e material também são preenchidos para demonstrar os filtros.
- [`assets/js/app.js`](assets/js/app.js): inicializa as páginas, apresenta os produtos e controla busca, filtros, ordenação, paginação, variações visuais, menu, favoritos, mensagens de feedback e carrinho. Também constrói os dados estruturados de produto e breadcrumb na página de produto.

Os registros de `products.js` são somente dados de exemplo. Na loja real, produtos, preços, disponibilidade, variações, imagens e avaliações devem vir do WooCommerce, não de uma lista fixada no navegador.

### Plano de referência

- [`docs/plan.md`](docs/plan.md): escopo original, identidade visual desejada, páginas, seções, funcionalidades e critérios para a futura loja.

## Páginas e seções

### Página inicial — `index.html`

1. **Barra superior:** mensagem curta sobre ofertas, pagamento e WhatsApp.
2. **Cabeçalho:** marca, busca, conta, favoritos e acesso ao carrinho; em telas pequenas, menu, busca compacta e carrinho.
3. **Menu principal:** links por ambiente, ofertas e contato; o item “Móveis” abre um mega menu em desktop.
4. **Hero:** fotografia de ambiente, mensagem principal e chamadas para compra e WhatsApp.
5. **Ambientes:** cartões para sala de estar, sala de jantar, quarto, cozinha, escritório e área externa.
6. **Categorias:** faixa horizontal com categorias como sofás, racks, painéis, mesas, cadeiras, camas, armários e poltronas.
7. **Ofertas da semana:** cards gerados a partir dos produtos de demonstração com desconto, preço, parcelamento e botão de compra.
8. **Banner comercial:** imagem e mensagem “Sua casa. Seu estilo.”.
9. **Produtos em destaque:** grade de produtos marcados como destaque na lista de exemplo.
10. **Diferenciais:** entrega, pagamento, compra segura, atendimento, seleção de produtos e variedade.
11. **Inspiração:** cartões de ambientes com links para categorias correspondentes.
12. **Mais vendidos:** faixa horizontal com produtos marcados como favoritos dos clientes no conjunto demonstrativo.
13. **Instagram:** grade de seis imagens e link para o perfil; ainda não consome publicações reais.
14. **Newsletter:** formulário visual com nome, e-mail e WhatsApp.
15. **Rodapé:** marca, navegação institucional, categorias, atendimento e links sociais.
16. **WhatsApp flutuante:** atalho para iniciar uma conversa com mensagem pré-preenchida.
17. **Carrinho lateral:** drawer compartilhado com as demais páginas.

### Página de categoria — `categoria.html`

- Breadcrumb e título/descrição atualizados a partir da categoria, busca ou consulta de ofertas.
- Filtros demonstrativos de categoria, preço, marca, cor, material e disponibilidade.
- Ordenação por relevância, preço crescente, preço decrescente ou nome.
- Grade paginada de produtos com nove itens por página.
- Painel de filtros que se transforma em drawer no celular e estado de resultados vazios.
- A busca usa o parâmetro `q`; as categorias usam `categoria` e a listagem de ofertas usa `ofertas=1`.

### Página de produto — `produto.html`

- O parâmetro `id` seleciona um registro, por exemplo `produto.html?id=sofa-linho`.
- Galeria visual com miniaturas e imagem principal.
- Nome, referência, avaliação, descrição, preço promocional e parcelamento.
- Seleção visual de cor e quantidade.
- Botão para adicionar ao carrinho e link para tirar dúvidas pelo WhatsApp.
- Abas/âncoras de descrição, características, dimensões, entrega, pagamento e avaliações.
- Grade de produtos relacionados.

As variações, medidas, avaliações e características são demonstrações de interface: não correspondem a variações ou dados validados no WooCommerce.

## Como usar e executar

O projeto não precisa de instalação de dependências. Abra `index.html` diretamente no navegador ou, preferencialmente, inicie um servidor HTTP local na raiz do projeto para testar links e navegação entre páginas.

Por exemplo, com Python instalado:

```powershell
python -m http.server 8000
```

Depois, acesse <http://localhost:8000/>. O comando usa o servidor estático simples do Python; não representa um servidor de produção. Também é possível usar uma extensão de servidor local do editor.

Para verificar sintaxe dos scripts com Node.js, se estiver disponível:

```powershell
node --check assets/js/app.js
node --check assets/js/products.js
```

As chamadas a fontes, ícones e imagens externas dependem de conexão com a internet.

## Comportamentos e dados de demonstração

- **Catálogo:** a busca por nome/categoria, filtros, ordenação e paginação operam sobre os 20 registros locais.
- **Carrinho:** permite adicionar itens, alterar quantidades, remover produtos e ver subtotal. Os dados ficam no `localStorage` do navegador.
- **Favoritos:** alterna o estado de favorito dos cards e salva a seleção localmente.
- **Feedback:** mensagens aparecem após adicionar/remover itens e após o envio demonstrativo do formulário.
- **Newsletter:** valida campos obrigatórios no navegador, mostra uma confirmação local e limpa o formulário; não envia os dados para lugar algum.
- **Finalização:** o botão apresenta uma mensagem informando que a integração depende do WooCommerce; não efetua checkout.
- **Menu, gavetas e carrosséis:** interações simples em JavaScript nativo; não dependem de um framework.

O `localStorage` não sincroniza dispositivos, não valida estoque, não calcula frete e não deve substituir o carrinho transacional do WooCommerce.

## Acessibilidade, SEO e desempenho

### Acessibilidade

Há textos alternativos nas imagens de conteúdo, rótulos de formulário, nomes acessíveis para botões e links de ícone, link para pular ao conteúdo, regiões de navegação identificadas, foco visível, mensagens com `aria-live` e suporte à tecla `Escape` para fechar drawers e menu. Ainda é recomendável executar uma auditoria com leitor de tela e ferramenta automatizada após os ajustes de conteúdo reais.

### SEO e dados estruturados

- As páginas incluem idioma, título e descrição.
- A página inicial declara `Organization`, `FurnitureStore` e `WebSite` via JSON-LD.
- O detalhe de produto gera `Product`, `Offer` e `BreadcrumbList`.
- O catálogo declara breadcrumb.

O tipo `LocalBusiness` citado no plano não está incluído atualmente. Endereço, telefone, URLs oficiais, preços e outros dados estruturados precisam ser confirmados antes da publicação. A estrutura da página de catálogo também não substitui uma estratégia completa de SEO técnico em WordPress.

### Desempenho

O projeto usa imagens com `loading="lazy"` fora das áreas prioritárias e apresenta grades e layouts com Flexbox/Grid. As fotografias, a fonte e a biblioteca de ícones são recursos remotos; isso exige conexão e traz dependência da disponibilidade de terceiros. Para a loja publicada, prefira imagens otimizadas na biblioteca de mídia, tamanhos responsivos e carregamento gerenciado pelo WordPress.

## Evolução para WordPress e WooCommerce

O melhor aproveitamento da estrutura é preservar a identidade visual e os padrões de interface e substituir progressivamente os dados e operações demonstrativos pelos recursos nativos do CMS e do WooCommerce. Não é necessário reescrever o visual como um aplicativo JavaScript.

### 1. Criar a estrutura de um tema

O projeto ainda não contém os arquivos obrigatórios de um tema WordPress. Em uma nova etapa:

- Transforme a raiz em um diretório de tema, com um `style.css` na raiz contendo o cabeçalho de metadados exigido pelo WordPress. A folha atual `assets/css/style.css` é o ponto de entrada visual, mas **não** substitui esse arquivo de identificação do tema.
- Crie `functions.php` para registrar suporte a WooCommerce, imagens destacadas, logo personalizado, menus e carregamento de CSS/JavaScript.
- Enfileire `assets/css/style.css` e os scripts com `wp_enqueue_style()` e `wp_enqueue_script()`. Use a versão do tema ou a data de modificação do arquivo para cache; remova os parâmetros manuais `?v=...` usados durante o desenvolvimento.
- Reaproveite as folhas dentro de `assets/css/` e os componentes existentes como base do design system.

Uma organização possível, a ajustar à necessidade do tema:

```text
jr-galego-moveis/
├── style.css
├── functions.php
├── header.php
├── footer.php
├── front-page.php
├── archive-product.php
├── taxonomy-product_cat.php
├── single-product.php
├── template-parts/
│   ├── product-card.php
│   ├── home/
│   └── product/
└── assets/
    ├── css/
    ├── js/
    └── imgs/
```

### 2. Transformar páginas e elementos em templates

- **Página inicial:** migrar as seções de `index.html` para `front-page.php` e partes em `template-parts/home/`.
- **Estrutura compartilhada:** extrair o cabeçalho e o rodapé repetidos para `header.php`, `footer.php` e partes reutilizáveis para o mega menu, newsletter e carrinho.
- **Catálogo e categoria:** substituir o array local por loops de produtos e taxonomias do WooCommerce em `archive-product.php` e `taxonomy-product_cat.php`.
- **Produto:** utilizar `single-product.php` ou os hooks e partes de template do WooCommerce para mostrar produto simples/variável, galeria, atributos, preço, estoque, avaliação e formulário oficial de compra.
- **Card de produto:** adaptar o HTML de `productCard()` para um template parcial PHP, usando campos reais, URLs do WordPress e APIs do WooCommerce.

### 3. Conectar produtos, carrinho e checkout

- Importar os produtos do mock para o catálogo do WooCommerce, preservando identificadores, categorias, preços, imagens e descrições onde os dados comerciais forem confirmados.
- Usar o carrinho, cálculo de frete, estoque, cupons e sessões do WooCommerce. Substituir as funções de carrinho locais e o armazenamento `jr-galego-cart` pelas rotas e mecanismos suportados pelo WooCommerce, inclusive para atualização dinâmica quando necessária.
- Fazer o botão de compra adicionar o produto e a variação selecionada ao carrinho real. Direcionar a finalização para o checkout do WooCommerce, no lugar do aviso demonstrativo.
- Usar os atributos e variações reais do produto; a seleção visual atual não confirma estoque, preço ou SKU de uma variação.
- Decidir separadamente como implementar favoritos, por exemplo com plugin compatível ou recurso associado à conta do cliente.

### 4. Conectar os serviços e conteúdo

- Ligar a newsletter a uma plataforma de e-mail ou endpoint com consentimento e política de privacidade apropriados.
- Substituir o telefone de exemplo em todos os links de WhatsApp e revisar o perfil social, domínio e URLs institucionais.
- Trocar as imagens remotas demonstrativas por fotografias aprovadas da loja, adicionadas à biblioteca do WordPress. Criar os textos alternativos a partir do conteúdo real.
- Tornar banners, ambientes e textos administráveis pelo WordPress se a equipe precisar atualizá-los sem editar o tema.
- Verificar se um plugin de SEO já produz schemas de produto e organização; evitar publicar JSON-LD duplicado.

## Limitações e preparativos para publicação

Antes de usar a loja publicamente, revise e conecte os itens abaixo:

- Substituir `5500000000000` pelo número de WhatsApp correto em todos os links.
- Confirmar o domínio declarado no JSON-LD e os endereços do Instagram e demais redes.
- Remover ou preencher links provisórios `#` (conta, políticas, entrega, trocas e conteúdo institucional).
- Confirmar preços, parcelamento, estoque, categorias, marcas, materiais, cores, avaliações e especificações dos produtos.
- Substituir imagens demonstrativas do Unsplash por imagens autorizadas e aprovadas para os produtos e ambientes da loja.
- Integrar newsletter, cálculo de entrega, formas de pagamento, carrinho e checkout a serviços reais.
- Definir política de privacidade, consentimento de newsletter, informações comerciais e condições de entrega/troca.
- Implementar e validar o tema WordPress/WooCommerce; o protótipo atual não pode ser instalado como tema e não armazena pedidos.

