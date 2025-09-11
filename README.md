<div align="center">
  <br />
  <p>
    <img src="https://i.imgur.com/LAV5caA.png" width="546" alt="Discord.js Bot Template" />
  </p>

  <p>
    <a href="https://discord.js.org/"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fmitsukiie%2FDiscord-Base-Typescript%2Fraw%2Fmain%2Fpackage.json&query=%24.dependencies%5B%22discord.js%22%5D&logo=discord&logoColor=ffffff&label=discord.js" alt="discord.js version"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/mitsukiie/Discord-Base-Typescript" alt="license"></a>
  </p>
</div>

---

# ⚡ Discord.js v14 Typescript Base

Um **template moderno e flexível** para criação de bots com [discord.js v14](https://discord.js.org) usando **TypeScript**.
Este é o sucessor do repositório [djs-template](https://github.com/mitsukiie/Discord-Base-Javascript).

---

## ✨ Características

- 📂 **Slash Command Handler** (suporte a comandos globais e de guilda)
- 🧩 **Subcommand Groups** (suporte a subcomandos)
- 🎯 **Event Handler** (eventos organizados automaticamente)
- ⚙️ **Configuração personalizável** no `settings.ts`
- 📝 **Exemplos prontos** para servir de base

---

## 🚀 Instalação

### Pré-requisitos

- [Bun](https://bun.sh/) instalado

### Instale as dependências:

```bash
bun install
```

### Configure o `.env`

Crie um arquivo `.env` no diretório raiz com as credenciais do bot.
Você pode usar o arquivo `example.env` como referência.

---

## ⚙️ Configuração

Toda a configuração do bot é feita em `src/settings.ts`.

### 🔹 Logs do terminal

Você pode controlar a forma como os logs são exibidos:

```ts
terminal: {
  // Modo dos logs: "minimalista" (simples) ou "informativo" (detalhado)
  mode: 'minimalista',

  // Logs de comandos
  showSlashCommandsFiles: false,    // Mostra cada arquivo de comando carregado
  showSlashCommandsRegistred: true, // Mostra quando comandos são registrados na API

  // Logs de eventos
  showEventsFiles: false,           // Mostra cada arquivo de evento carregado
  showEventsRegistred: true,        // Mostra quando eventos são registrados no client
}
```

### 🔹 Comandos globais e de guilda

Você pode optar por registrar comandos apenas em uma guilda específica:

```ts
bot: {
  guildID: [], // Vazio por padrão, adicione o id para registrar comando nesse servidor
}
```

---

## ▶️ Execução

Inicie o bot facilmente com:

```bash
bun start
```

> O Bun compila e executa automaticamente, sem precisar rodar `tsc` manualmente.

---

## 📂 Exemplos incluídos

Este template já vem com alguns exemplos para guiar você:

- `src/commands/utils/ping.ts` → comando `/ping`
- `src/commands/utils/user/ban.ts` → subcomando `/user ban`
- `src/commands/responders/` →  responders + modo de uso (README.md)
- `src/events/client/ready.ts` → evento `ready`

---

## 🛠️ Sobre este template

Este projeto está em **constante evolução** e será expandido com o tempo.
Se encontrar algum problema ou tiver sugestões, sinta-se à vontade para abrir uma issue.

---

🔹 **Desenvolvedor:** @mitsukiie

[![GitHub](https://img.shields.io/badge/GitHub-000?logo=github&logoColor=white)](https://github.com/mitsukiie)
[![Discord](https://img.shields.io/badge/Discord-5865F2?logo=discord&logoColor=white)](https://discord.com/users/1098021115571490947)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/caio-victor-66715b309/)
[![Email](https://img.shields.io/badge/Email-EA4335?logo=gmail&logoColor=white)](mailto:c.victor3815@gmail.com)
