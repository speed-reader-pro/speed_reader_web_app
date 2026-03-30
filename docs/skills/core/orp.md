# ORP (Optimal Recognition Point)

Algorithm for selecting the "pivot" letter for eye focus:

| Word Length | Pivot (index) | Highlighted Letter |
|-------------|---------------|-------------------|
| 1 | 0 | 1st |
| 2-5 | 1 | 2nd |
| 6-8 | 2 | 3rd |
| 9-12 | 3 | 4th |
| 13-17 | 4 | 5th |
| 18-25 | ~50% | middle |
| 26+ | ~60% | slightly right of middle |

## Word Delay Algorithm

Base delay: `60000 / WPM` ms

Multipliers:
- Long words (>8 characters): `+4%` per character over 8
- End of sentence (`.`, `!`, `?`): `+100%`
- Commas, semicolons, colons: `+40%`
- Dashes (`—`, `–`): `+40%`
- Ellipsis (`...`, `…`): `+50%`

---

[Back to SKILLS.md](../../SKILLS.md)
