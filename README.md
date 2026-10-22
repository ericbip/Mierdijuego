# Mierdijuego

Un pequeño juego web arcade, hecho con HTML, CSS y JavaScript vanilla. No necesita instalar dependencias.

## Cómo jugar

- Abre `index.html` en un navegador o sirve la carpeta con cualquier servidor estático.
- Muévete con `←` / `→` o `A` / `D`.
- Esquiva los obstáculos y aguanta todo lo posible.
- Pulsa **Jugar de nuevo** para reiniciar.

## Desarrollo local

Puedes usar la extensión **Live Server** de VS Code o ejecutar:

```bash
python -m http.server 8000
```

Después abre http://localhost:8000.

## Estructura

```text
.
├── index.html
├── styles.css
├── src/
│   └── main.js
├── .gitignore
└── README.md
```

## Personalización

La lógica del juego está en `src/main.js`; los estilos, en `styles.css`; y la estructura de la página, en `index.html`.

## Licencia

Todavía no se ha elegido una licencia. Hasta entonces, no se concede ninguna licencia de reutilización por defecto.
