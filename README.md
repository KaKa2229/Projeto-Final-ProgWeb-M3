Loja do Carlão - Projeto Final de Programação Web (M3)

Descrição: 

O objetivo foi evoluir um protótipo de front-end estático para uma aplicação Full Stack robusta em que originalmente o sistema era um Front-end simples que apenas consultava dados diretamente de uma API externa (FakeStore). Neste trabalho da M3, o projeto foi reaplicado e transformado em uma aplicação Full Stack completa, onde os dados da API externa são agora importados e persistidos em um servidor próprio (Node.js/Express) conectado a um banco MySQL.

O sistema simula um fluxo de compra completo:

    1. Catálogo: Exibe produtos importados da FakeStore API e salvos em um banco MySQL.
    
    2. Carrinho: Controla a quantidade em tempo real no servidor, validando a disponibilidade antes da compra.
    ️
    3. Checkout: Processa pedidos utilizando transações para garantir que o estoque seja baixado.
    
    4. Meus Pedidos (Histórico de Compras): Permite consultar pedidos registrados por clientes.

A arquitetura do Back-end segue o padrão de camadas (Routes, Controllers, Services, Prisma) para garantir a modularidade e organização.
 
Tecnologias Utilizadas:

Backend 

    Servidor: Node.js com Express

    Banco de Dados: MySQL

    ORM: Prisma

    Módulos Adicionais: dotenv, cors

Frontend 

    Estrutura: HTML

    Estilização: Bootstrap e CSS 

    Lógica: JavaScript
