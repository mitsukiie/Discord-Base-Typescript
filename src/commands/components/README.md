# 📦 Display Components V2
Os **Display Components V2** permitem montar mensagens ricas com blocos de texto, sections, botões, galerias, arquivos e selects.

Guia atualizado para usar os helpers de componentes com a API atual:

- `message.reply(interaction, { components, ephemeral? })`
- `ui.*` para montar componentes

---

# 🚀 Comandos de exemplo

- `src/commands/components/section.ts` -> section com texto e botao
- `src/commands/components/selects.ts` -> todos os tipos de select
- `src/commands/components/media.ts` -> gallery + file
- `src/commands/components/container.ts` -> envio com `ui.container`

---

# 📖 Envio de mensagem

```ts
await message.reply(interaction, {
  components,
  ephemeral: true,
});
```

O campo `ephemeral` e opcional.

---

# 🔹 Componentes base

```ts
'## Titulo';
ui.text('Texto comum');
ui.divider();
ui.row(ui.button('Confirmar', 'confirm:id'));
```

---

# 🔹 Section

```ts
ui.section(['Linha 1', 'Linha 2'], {
  button: ui.button('Abrir', 'open:id'),
});
```

Ou com thumbnail:

```ts
ui.section(['Linha 1'], {
  thumbnail: ui.thumbnail('https://picsum.photos/id/1003/300/300', 'Miniatura'),
});
```

---

# 🔹 Select Menus

Tipos disponiveis:

- `ui.select.string(...)`
- `ui.select.user(...)`
- `ui.select.role(...)`
- `ui.select.channel(...)`
- `ui.select.mentionable(...)`

Exemplo:

```ts
ui.row(ui.select.user('select:user', { placeholder: 'Selecione usuarios' }));
ui.row(ui.select.role('select:role', { placeholder: 'Selecione cargos' }));
```

---

# 🔹 Gallery e File

```ts
ui.gallery(
  ui.image('https://picsum.photos/id/1015/900/500', 'Imagem 1'),
  ui.image('https://picsum.photos/id/1018/900/500', 'Imagem 2'),
);
```

Arquivo com attachment automatico:

```ts
const file = new AttachmentBuilder(Buffer.from('Conteudo do arquivo'), {
  name: 'example.txt',
});

ui.file.fromAttachment(file);
```

---

# 🔹 Com e sem container

Sem container:

```ts
await message.reply(interaction, {
  components: ['## Sem container', ui.divider()],
});
```

Com container:

```ts
const content = ui.container(
  {
    color: "#000000", // Opcional e somente hexadecimal
    text: "## Com container" // Opcional
    description: "Descrição opcional tambem"
  },

  // ou simplesmente
  '## Com container',
  ui.divider()
);

await message.reply(interaction, {
  components: [content],
});
```

---

# ✅ Regras importantes

- `section`: 1 a 3 textos.
- `row`: 1 a 5 componentes.
- `select` deve ficar sozinho na row.
- `gallery`: 1 a 10 imagens.
- `button customId`: 1 a 100 caracteres.
- URLs de imagem/thumbnail: `http://` ou `https://`.

---

Use os comandos de exemplo como base e adapte os `customId` para os seus responders.
> O Display Components V2 pode melhorar com o tempo, feedback ajuda muito.