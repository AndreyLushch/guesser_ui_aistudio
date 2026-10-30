/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const STRINGS = {
  appTitle: 'Угадайка',
  appSubtitle: 'Партийная игра в слова для живой компании',

  // Formats
  formats: {
    teams: 'Команды',
    solo: 'Каждый сам за себя',
    pair: 'Вдвоём',
    teamsDesc: 'Командное соревнование (от 4 игроков). Случайный ровный делёж.',
    soloDesc: 'Каждый сам за себя (3 игрока). Очко получают и объяснивший, и угадавший.',
    pairDesc: 'Кооперативный режим на двоих (2 игрока). Играем против колоды и времени.',
  },

  // Modes
  modes: {
    step: 'Один шаг',
    sprint: 'Спринт',
    stepDesc: 'Одно слово на ход и короткий таймер (20 с). Смена команды после каждого слова.',
    sprintDesc: 'Таймер на весь ход (60 с). Слова идут потоком одно за другим.',
  },

  // Score modes
  scoreModes: {
    soft: 'Мягкий',
    hard: 'Жёсткий',
    softDesc: 'Угадано: +1 ходящей команде. Пропуск или отмена: 0 очков.',
    hardDesc: 'Угадано: +1 ходящей команде. Пропуск, тайм-аут или отмена: +1 следующей команде по кругу.',
  },

  // Lobby
  lobby: {
    title: 'Лобби партии',
    playersCount: (count: number) => `Игроков: ${count}`,
    hostBadge: 'Ведущий',
    youBadge: 'Ты',
    teamsSetup: 'Составы команд',
    shuffle: 'Перемешать команды',
    teamsCountLabel: 'Число команд:',
    unbalancedAlert: 'Составы неровные — перемешайте команды для баланса!',
    circlesCount: 'Кругов:',
    wordsCount: 'Слов в колоде:',
    startGame: 'Начать игру',
    waitingForHost: 'Ждём, пока ведущий начнёт игру...',
    minPlayersWarning: 'Для игры нужно минимум 2 игрока',
    teamsUnbalanced: 'составы неровные — перемешайте',
  },

  // Seating
  seating: {
    title: 'Рассаживайтесь по командам',
    subtitle: 'Сядьте рядом со своими сокомандниками или кругом!',
    yourPlace: 'Твоя команда:',
    hostReadyBtn: 'Все на местах — начинаем',
    waitingHost: 'Ждём, пока ведущий подтвердит рассадку...',
  },

  // Header & Progress
  progress: {
    circle: (current: number, max: number) => `Круг ${current} из ${max}`,
    words: (left: number, total: number) => `Слова ${left} / ${total}`,
    teamYou: (name: string) => `Ты в команде ${name}`,
    teamSolo: 'Играешь сам за себя',
    teamPair: 'Вдвоём',
  },

  // Turn waiting
  waitingTurn: {
    title: (teamName: string) => `Ход команды ${teamName}`,
    speakerAnnounce: (speakerName: string) => `Объясняет: ${speakerName}`,
    youAreSpeaker: 'Ты объясняешь!',
    speakerInstruction: 'Когда команда будет готова — нажми кнопку ниже:',
    showTaskBtn: 'Показать слово',
    teammatesInstruction: 'Ход вашей команды! Слушайте внимательно и угадывайте вслух!',
    opponentsInstruction: (teamName: string) => `Ход команды ${teamName} — слушайте и следите за честностью!`,
    speakerOfflineWarning: (speakerName: string) => `${speakerName} не в сети! Сервер выберет другого объясняющего.`,
  },

  // Active Turn
  activeTurn: {
    wordsGuessedInTurn: (n: number) => `Угадано за ход: ${n}`,
    endTurnEarly: 'Закончить ход',
    guessedBtn: 'Угадали!',
    skipBtn: 'Пропустить',
    whoGuessedTitle: 'Кто угадал слово?',
    whoGuessedPrompt: 'Выбери игрока, который назвал слово первым:',
    speakerListeningTitle: 'Слушай объяснение!',
    speakerExplaining: (name: string) => `${name} объясняет слово своей команде...`,
    timerPaused: 'Пауза (идёт спор)',
  },

  // Sprint Speaker Claim
  speakerClaim: {
    claimed: (word: string, sec: number) => `Угадано: ${word} · ${sec} с`,
    cancelBtn: 'Отмена',
  },

  // Dispute Window
  dispute: {
    teamGuessedWord: (teamName: string, word: string) => `${teamName} угадали: ${word}`,
    playerGuessedWord: (playerName: string, word: string) => `Угадано: ${playerName} · ${word}`,
    cancelBtn: 'Отмена',
    pairNote: 'Отмена — слово не засчитается, без голосования',
    autoAcceptIn: (sec: number) => `Засчитается через ${sec} с`,
  },

  // Voting
  voting: {
    question: (word: string, teamName?: string) =>
      teamName ? `Засчитать слово «${word}» команде ${teamName}?` : `Засчитать слово «${word}»?`,
    voteYes: 'Да',
    voteNo: 'Нет',
    status: (yes: number, no: number, total: number, max: number) =>
      `Да ${yes} · Нет ${no} · проголосовали ${total} из ${max}`,
    votedWaiting: 'Ты проголосовал, ждём остальных...',
  },

  // Vote Result
  voteResult: {
    approved: 'Слово засчитано!',
    rejected: 'Слово не засчитано!',
    tie: 'Ничья — засчитано!',
    scoreDetails: (yes: number, no: number) => `Голоса: За ${yes} · Против ${no}`,
  },

  // Finished / Game Over
  finished: {
    title: 'Партия завершена!',
    winnerCongrats: (teamName: string) => `Победила команда ${teamName}!`,
    tieTitle: 'Ничья!',
    playAgain: 'Играть ещё раз',
    chooseAnotherGame: 'Выбрать другую игру',
    hostChooses: 'Ведущий выбирает, что дальше...',
    placeBadge: (place: number) => `${place}-е место`,
    scorePoints: (pts: number) => `${pts} ${pts === 1 ? 'очко' : pts >= 2 && pts <= 4 ? 'очка' : 'очков'}`,
  },

  // Connection & Offline
  connection: {
    offlinePlayers: (names: string) => `Не в сети: ${names}`,
    teamOfflineWarning: 'Команда не в сети — ходы пропускаются',
    reconnecting: 'Переподключаемся к серверу...',
    actionPending: 'Ждём сервер...',
  },

  // Rules
  rules: {
    title: 'Правила игры «Угадайка»',
    summary: 'Шумная командная игра на объяснение слов для живой компании. Объясняйте слова вслух, не называя однокоренных.',
    formatsHeading: 'Форматы игры',
    modesHeading: 'Режимы хода',
    scoringHeading: 'Начисление очков',
    disputeHeading: 'Спор и отмена',
    close: 'Понятно',
  },
};
