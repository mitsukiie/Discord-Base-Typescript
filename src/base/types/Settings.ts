// Interface principal para definir as configurações do bot
export interface Settings {
  terminal: {
    /**
     * Define o "estilo" dos logs no terminal
     * - "informativo": mostra todos os detalhes
     * - "minimalista": mostra apenas logs essenciais
     */
    mode: 'informativo' | 'minimalista';

    // Mostrar no terminal os arquivos de comandos carregados? (true/false)
    showSlashCommandsFiles?: boolean;

    // Mostrar no terminal quando os comandos forem registrados na API? (true/false)
    showSlashCommandsRegistred?: boolean;

    // Mostrar no terminal os arquivos de eventos carregados? (true/false)
    showEventsFiles?: boolean;

    // Mostrar no terminal quando os eventos forem registrados? (true/false)
    showEventsRegistred?: boolean;
  };

  bot: {
    /**
     * ID do dono do bot (opcional)
     * Pode ser usado para permissões exclusivas
     */
    onwerID?: string;

    /**
     * Cooldown global padrão (em segundos, opcional)
     * Define o tempo mínimo entre execuções de comandos
     */
    cooldonw?: number;

    /**
     * Token do bot (obrigatório)
     * Fornecido no portal de desenvolvedores do Discord
     */
    token: string;

    /**
     * Client ID do bot (obrigatório)
     * Necessário para registrar os comandos globalmente via API
     */
    clientID: string;

    /**
     * Guild ID (obrigatório se guildCommands for true)
     * Necessário para registrar os comandos apenas em um servidor
     */
    guildID?: string;

    /**
     * Define se os comandos serão registrados apenas no servidor (guild)
     * - true: comandos apenas no servidor especificado em guildID
     * - false: comandos globais
     */
    guildCommands?: boolean;
  };
}
