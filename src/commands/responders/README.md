# 📌 Responders

Os **responders** permitem lidar com interações dinâmicas no Discord, como botões, selects e modais.  
Eles usam `customId` com parâmetros e podem ter validação via **Zod** ou manualmente.

---

## 🚀 Exemplos

- `src/commands/responders/button.ts` → responder para `botão`
- `src/commands/responders/modal.ts` → responder para `modal`
- `src/commands/responders/select.ts` → responder para `select menu`

---

## 📖 Como funciona

### 🔹 Parâmetros

- Definidos na rota com `:param`
  - Exemplo: `responder/:id`
  - Pode ter múltiplos: `responder/:id/:name`

- Sempre chegam como **string** se não houver parse
- O `parse` pode transformar/validar:
  - Com **Zod**:

    ```ts
    const schema = z.object({ id: z.coerce.string() });
    ...
    parse: schema.parse
    ```

  - Manualmente:

    ```ts
    parse: (params) => ({ id: Number(params.id), name: params.name });
    ```

### 🔹 Cache

- `permanent` → nunca expira
- `once` → só pode ser usado uma vez
  _(dica: use IDs únicos para cada interação)_
- `temporary` → válido até o tempo definido em `expire` (ms)

### 🔹 Tipos de interação

- **Button** → `ResponderType.Button`
- **Select Menu** → `ResponderType.Select`
- **Modal** → `ResponderType.Modal`
- **SelectString** → `ResponderType.SelectString`
- **SelectUser** → `ResponderType.SelectUser`
- **SelectRole** → `ResponderType.SelectRole`
- **SelectChannel** → `ResponderType.SelectChannel`
- **SelectString** → `ResponderType.SelectString`
- **SelectMentionable** → `ResponderType.SelectMentionable`

A função `run` sempre recebe:

```ts
run(interaction, params);
```

Onde `params` são os valores extraídos da rota.

---

## 📌 Exemplo sem parâmetros

```ts
createResponder({
  customId: 'user/button',
  types: ResponderType.Button,
  async run(interaction) {
    await interaction.reply('Responder sem parâmetros!');
  },
});
```

---

✅ Agora basta criar responders seguindo esse padrão!
