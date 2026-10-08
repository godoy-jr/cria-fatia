# Bella Roza Pizzaria — Cria Fatia

Montador de pizza artesanal responsivo feito com HTML, CSS e JavaScript puro. O cliente monta a pizza em um fluxo guiado, vê a prévia ilustrada e confere o preço antes de preencher os dados de entrega.

## Como executar

Abra `index.html` em um navegador moderno. Não é necessário instalar dependências nem iniciar um servidor.

## Fluxo e regras

- Boas-vindas e chamada para montar uma pizza.
- Tamanho: Broto (4 pedaços, R$ 25), Média (6 pedaços, R$ 35) ou Grande (8 pedaços, R$ 45).
- Massa Normal inclusa ou Integral por mais R$ 4.
- Molho de tomate opcional.
- Até 8 ingredientes entre opções da casa ou ingrediente personalizado.
- Montagem uniforme na pizza inteira ou personalização fatia por fatia, com seletor visual interativo.
- Na montagem por fatias, ingredientes repetidos são contabilizados uma vez no limite e no preço.
- Sugestões de combinações (Marguerita, Calabresa da casa e Caipira cremosa) que podem ser aplicadas à pizza inteira ou à fatia selecionada.
- Prévia ilustrada em SVG com borda assada texturizada, pontos tostados, queijo e molho em camadas, ingredientes desenhados com formas próprias e rotação variável, animação de montagem, cortes destacados, zoom opcional na fatia ativa e preço atualizado ao vivo.
- Prévia com uma foto local de referência ([“Margherita pizza on plate”](https://commons.wikimedia.org/wiki/File:Margherita_pizza_on_plate.jpg), de Shisma / Wikimedia Commons, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)); os ingredientes escolhidos continuam sendo sobrepostos ao vivo, e a arte SVG é usada como fallback se a foto não carregar.
- Os 4 primeiros ingredientes diferentes são inclusos; cada ingrediente adicional custa R$ 3.
- Orégano opcional, resumo detalhado, pagamento (PIX, cartão ou dinheiro) e endereço.
- Confirmação com dados do pedido e link para avaliação no Google.

## Escopo da demonstração

Este é um protótipo acadêmico executado inteiramente no navegador. Não há servidor, processamento de pagamento, cálculo de taxa de entrega, armazenamento de dados nem transmissão real de pedidos para a cozinha. Os preços são exemplos para a demonstração.
