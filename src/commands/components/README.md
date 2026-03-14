# 📦 Display Components V2

Os **Display Components V2** permitem montar mensagens ricas com textos, sections, botões, galerias, arquivos e selects.

---

# 🚀 Comandos de exemplo

| Arquivo                  | O que demonstra                            |
| ------------------------ | ------------------------------------------ |
| `component/section.ts`   | Section com textos e botão                 |
| `component/selects.ts`   | Todos os tipos de select menu              |
| `component/media.ts`     | Gallery + file com attachment automático   |
| `component/container.ts` | Envio com `ui.container` e cor de destaque |

---

# 📖 Fluxo básico

Todo envio segue dois passos:

```ts
// 1. Montar os componentes com ui.render(...)
const components = ui.render(ui.text('## Titulo'), ui.divider());

// 2. Enviar com message.reply
await message.reply(interaction, { components, ephemeral: true });
```

> `components` **deve** vir de `ui.render(...)`. Passar um array criado manualmente causa erro.

`ephemeral` é opcional.

---

# 🔹 Componentes

### Texto e separador

```ts
ui.text('## Titulo markdown');
ui.divider();
```

### Botão / Row

```ts
ui.row(
  ui.button({ label: 'Confirmar', customId: 'confirm:id' }),
  ui.button({ label: 'Cancelar', customId: 'cancel:id', style: ButtonStyle.Danger }),
);
```

`emoji` também é aceito em `ui.button({ ..., emoji: '✅' })`.

### Section

Agrupa 1 a 3 textos com um botão **ou** thumbnail acessório (não os dois).

```ts
ui.section(['Linha 1', 'Linha 2'], {
  button: ui.button({ label: 'Abrir', customId: 'open:id' }),
});

ui.section(['Linha 1'], {
  thumbnail: ui.thumbnail({
    url: 'https://picsum.photos/id/1003/300/300',
    description: 'Miniatura',
  }),
});
```

### Select Menus

Cada select precisa ficar sozinho na `row`.

Os builders aceitam dois estilos de chamada:

- `ui.select.user('select:user', { placeholder: 'Selecione usuario' })`
- `ui.select.user({ customId: 'select:user', placeholder: 'Selecione usuario' })`

```ts
ui.row(
  ui.select.string(
    'select:id',
    [
      { label: 'Opcao A', value: 'a' },
      { label: 'Opcao B', value: 'b' },
    ],
    { placeholder: 'Escolha...' },
  ),
);

ui.row(ui.select.user('select:user', { placeholder: 'Selecione usuario' }));
ui.row(ui.select.user({ customId: 'select:user', placeholder: 'Selecione usuario' }));

ui.row(ui.select.role('select:role', { placeholder: 'Selecione cargo' }));
ui.row(ui.select.role({ customId: 'select:role', placeholder: 'Selecione cargo' }));

ui.row(ui.select.channel('select:channel', [ChannelType.GuildText]));
ui.row(
  ui.select.channel({
    customId: 'select:channel',
    channelTypes: [ChannelType.GuildText],
    placeholder: 'Selecione canal',
  }),
);

ui.row(ui.select.mentionable('select:mentionable'));
ui.row(ui.select.mentionable({ customId: 'select:mentionable' }));

ui.row(
  ui.select.string({
    customId: 'select:string',
    options: [
      { label: 'Opcao A', value: 'a' },
      { label: 'Opcao B', value: 'b' },
    ],
    placeholder: 'Escolha...',
  }),
);
```

### Gallery e File

```ts
ui.gallery(
  ui.image({ url: 'https://picsum.photos/id/1015/900/500', description: 'Imagem 1' }),
  ui.image({ url: 'https://picsum.photos/id/1018/900/500', description: 'Imagem 2' }),
);

const file = new AttachmentBuilder(Buffer.from('conteudo'), { name: 'exemplo.txt' });
ui.file.fromAttachment(file); // gera attachment://exemplo.txt automaticamente
```

---

# 🔹 Container

Agrupa componentes em um bloco com borda. Aceita `color` opcional no formato hex.

```ts
const components = ui.render(
  ui.container(
    { color: '#0099ff' }, // opcional
    ui.text('## Titulo'),
    ui.divider(),
    ui.row(ui.button({ label: 'OK', customId: 'ok' })),
  ),
);
```

Sem opções:

```ts
ui.container(
  ui.text('## Titulo'),
  ui.gallery(...),
)
```

`color` aceita `'#0099ff'`, `'0x0099ff'` ou `0x0099ff`.

---

# ✅ Regras

| Componente                     | Limite                  |
| ------------------------------ | ----------------------- |
| `message.reply` components     | máximo 40               |
| `section` textos               | 1 a 3                   |
| `row` componentes              | 1 a 5                   |
| `select` na row                | deve ficar sozinho      |
| `gallery` imagens              | 1 a 10                  |
| `button` / `select` `customId` | 1 a 100 caracteres      |
| URLs de imagem/thumbnail       | `http://` ou `https://` |
