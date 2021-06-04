# API_SMART_RANKING

### Tecnologias utilizadas 
- **NestJS** </br>
Nest (NestJS) é uma estrutura para a construção de aplicativos Node.js do lado do servidor eficientes e escaláveis . Ele usa JavaScript progressivo, é construído com e suporta totalmente TypeScript (ainda permite que os desenvolvedores codifiquem em JavaScript puro) e combina elementos de OOP (Programação Orientada a Objetos), FP (Programação Funcional) e FRP (Programação Reativa Funcional).

 - **RabbitMQ** </br>
  RabbitMQ é um servidor de mensageria de código aberto (open source) desenvolvido em Erlang, implementado para suportar mensagens em um protocolo denominado Advanced Message Queuing Protocol (AMQP). Ele possibilita lidar com o tráfego de mensagens de forma rápida e confiável, além de ser compatível com diversas linguagens de programação, possuir interface de administração nativa e ser multiplataforma.
Dentre as aplicabilidades do RabbitMQ estão possibilitar a garantia de assincronicidade entre aplicações, diminuir o acoplamento entre aplicações, distribuir alertas, controlar fila de trabalhos em background.

 - **Docker** </br>
 Docker é um conjunto de produtos de plataforma como serviço (PaaS) que usam virtualização de nível de sistema operacional para entregar software em pacotes chamados contêineres. Os contêineres são isolados uns dos outros e agrupam seus próprios softwares,  e arquivos de configuração. Eles podem se comunicar uns com os outros por meio de canais bem definidos Todos os contêineres são executados por um único kernel do sistema operacional e, portanto, usam menos recursos do que as máquinas virtuais.
 
###  Arquitetura  monolítica

<img width="461" alt="mono" src="https://user-images.githubusercontent.com/31168253/120840761-03122900-c541-11eb-8265-e1f7ba7e18b2.png">

### Arquitetura de microsserviços

![image](https://user-images.githubusercontent.com/31168253/120841017-5ab09480-c541-11eb-8f76-e3fa69c130d9.png)

![image](https://user-images.githubusercontent.com/31168253/120841303-b7ac4a80-c541-11eb-83d2-465a12860280.png)

![image](https://user-images.githubusercontent.com/31168253/120841365-cabf1a80-c541-11eb-891e-0cd51c2f55ea.png)

![image](https://user-images.githubusercontent.com/31168253/120841478-ec200680-c541-11eb-8498-286e06411f23.png)

### Por que usar MicroServices??
 - Facilitar a implementação de novas features, uma vez que teremos domínios de negócio exclusivos em cada microservice
 
 - Autonomia para nossos componentes de modo que possamos desenvolver e publicar serviços de forma independente
 
 - Aumentar a capacidade de escalabilidade horizontal e balanceamento de carga
 
 - Maior resiliência / Tolerância a falhas

Ao adotar este modelo arquitetural, no mínimo, você deveria se preocupar com: 

• Agilidade em seu processo de provisionamento e deployment (CI/CD) • Monitoramento robusto 
• Abraçar a cultura devops 
• Testes de resiliência e injeção de falhas passam a ser essenciais na sua vida
