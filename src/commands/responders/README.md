# 📌 Responders

Os **responders** permitem lidar com interações dinâmicas no Discord, como **botões, selects e modais** usando `customId` com parâmetros. 

Eles funcionam de forma semelhante a **rotas**, permitindo extrair valores diretamente do `customId` e opcionalmente validá-los usando **Zod** ou funções customizadas.

---

# 🚀 Exemplos

- `src/commands/responders/button.ts` → responder para `botão`
- `src/commands/responders/modal.ts` → responder para `modal`
- `src/commands/responders/select.ts` → responder para `select menu`

---

# 📖 Como funciona

## 🔹 Parâmetros na rota
Parâmetros são definidos usando `:` dentro do `customId`.

Exemplo:
```ts
customId: "responder/:id"
```

Também é possível ter múltiplos parâmetros:
```ts
customId: "responder/:id/:name"
```

Se **nenhum `parse` for definido**, os parâmetros sempre chegam como string.

---

## 🔹 Parse de parâmetros
O `parse` permite transformar ou validar os parâmetros antes de executar o responder.

Ele pode ser:

* um **schema Zod**
* uma **função manual**

```ts
parse: schema.parse
// ou
parse: (params) => ({ id: Number(params.id) })
```

Se nenhum `parse` for definido, os parâmetros serão **strings**.

---

## 🔹 Cache
Os responders podem ter controle de uso usando `cache`.

### once
Permite usar o responder **apenas uma vez**.
```ts
cache: "once"
```

### temporary
Permite usar o responder por um **tempo limitado**.
```ts
cache: "temporary",
expire: 60000 // 1 minuto
```

---

## 🔹 Tipos de interação
Tipos disponíveis em ResponderType:

- **Button**
- **Select Menu**
- **Modal**
- **SelectString**
- **SelectUser**
- **SelectRole**
- **SelectChannel**
- **SelectString**
- **SelectMentionable**

Exemplo:
```ts
type: ResponderType.Button
```

Também é possível registrar o mesmo responder para mais de um tipo:

```ts
type: [ResponderType.Button, ResponderType.SelectString]
```

Nesse caso, o `interaction` vira uma união dos dois tipos e você deve fazer guarda de tipo no `run`:

```ts
createResponder({
  customId: 'responder/:id',
  type: [ResponderType.Button, ResponderType.SelectString],

  async run(interaction, { id }) {
    if (interaction.isButton()) {
      await interaction.reply(`Botão clicado por ${id}`);
      return;
    }

    if (interaction.isStringSelectMenu()) {
      await interaction.reply(`Select usado por ${id}: ${interaction.values.join(', ')}`);
    }
  },
});
```

---

## 🔹 Estrutura da função `run`
A função `run` recebe dois parâmetros:

```ts
  run(interaction, params)
```

* **interaction** → interação do Discord tipada automaticamente
* **params** → parâmetros extraídos do `customId`

### Destructuring de parâmetros
Você também pode usar **destructuring** diretamente nos parâmetros:

```ts
createResponder({
  customId: "user/:id/:name",
  type: ResponderType.Button,

  async run(interaction, { id, name }) {
    await interaction.reply(`ID: ${id} | Nome: ${name}`);
  },
});
```

### Exemplo simples
Se a rota não possuir parâmetros, o `params` pode ser omitido:

```ts
createResponder({
  customId: "user/button",
  type: ResponderType.Button,

  async run(interaction) {
    await interaction.reply("Responder sem parâmetros!");
  },
});
```

---

✅ Agora basta criar responders seguindo esse padrão!
