# Источники скиллов

Профиль в `.claude/skills/` собран из открытых наборов. Здесь перечислено только то, что
фактически включено в этот репозиторий.

## pstack

Автор: Lauren Tan. Источник: https://github.com/cursor/plugins/tree/main/pstack
Лицензия: MIT, `licenses/pstack-MIT.txt`
Снимок, из которого взят набор: `eb4db2b55b2b7dec3d9282754cddf0a56bf4ff10`

Включены: `architect`, `blast-radius`, `bro`, `correct`, `create-verification-skill`,
`figure-it-out`, `how`, `in-your-own-words`, `ketchup`, `maintain-verification-skill`, `sharpen`,
`show-me-your-work`, `tdd`, `technical-writing`, `typescript-best-practices`, `unslop`,
`writing-for-agents` и 19 скиллов `principle-*`.

`deslop` происходит из cursor-team-kit, лицензия `licenses/cursor-team-kit-LICENSE.txt`.

Не включены: `poteto-mode`, `poteto-help`, `setup-pstack`, `arena`, `swarm`, `interrogate`,
`reflect`, `no-comments`, `why`, `teach`, `recall`, `automate-me`, `statechart`, `control-cli`,
`benchmark-checklist`, формальная верификация и 5 скиллов `principle-*`. Причина — в
`.claude/skills/zapys-mode/references/runtime.md`: их ценность в параллельных исполнителях и
нескольких моделях одновременно, чего в этой среде нет.

## Matt Pocock

Источник: https://github.com/mattpocock/skills
Лицензия: MIT, `licenses/Matt-Pocock-MIT.txt`

Включены: `grilling`, `grill-with-docs`, `domain-modeling`.

## Что изменено при переносе

- Ссылки `.agents/skills/` переписаны на `.claude/skills/`: на Windows ссылки каталогов
  ненадёжны, поэтому копия одна.
- Упоминания `poteto-mode` заменены на `zapys-mode`.
- Текст скиллов в остальном не менялся. Инструкции, относящиеся к Cursor, приложению bb и выбору
  моделей, остались в них как есть и переопределяются файлом рантайма.

## Своё

`zapys-mode`, `verify-zapys`, `AGENTS.md`, `CONTEXT.md` и `docs/` написаны для этого проекта.

Идея процесса, устройство проверочного скилла и набор принципов взяты из pstack и из материалов
Merlin Builds (https://t.me/merlin_builds). Программы bb, Codex, MacWhisper, Cua и плагин
Generative UI в этот репозиторий не входят и здесь не используются.
