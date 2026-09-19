# Capacidades de dispositivos

## Fuente de verdad

El conector decide las capacidades en este orden:

1. `fullFunctionNames` o `shortFunctionNames` anunciados por el dispositivo.
2. Catálogo conservador por `toyType`/nombre.
3. Estado `unknown`: la interfaz lo muestra como “funciones por confirmar” y Lovense valida la orden final.

Esto evita asumir que todos los Lovense vibran o que dos revisiones de hardware son idénticas.

## Acciones y rangos de la Standard API

| Acción | Rango |
| --- | --- |
| Vibrate | 0–20 |
| Rotate | 0–20 |
| Pump | 0–3 |
| Thrusting | 0–20 |
| Fingering | 0–20 |
| Suction | 0–20 |
| Depth | 0–3 |
| Stroke | 0–100; se usa junto a Thrusting y necesita al menos 20 puntos entre mínimo y máximo |
| Oscillate | 0–20 |

Lovense Remote 7.71.0 o posterior acepta una matriz de IDs. El conector envía una orden por juguete para conservar compatibilidad con versiones anteriores y permitir selecciones múltiples.

## Límites honestos

- La Standard API no documenta una acción `Heat`, por eso el conector no intenta controlar calor.
- Algunos payloads del Standard Socket API incluyen el modelo y la lista de juguetes, pero no las funciones. En ese caso se usa el catálogo.
- Un modelo nuevo queda como `unknown` hasta confirmar sus funciones; no se le inventan capacidades.
- La entrega por socket no trae una confirmación documentada por orden. El resultado MCP significa “orden puesta en cola”, no prueba física de ejecución.

Fuentes: [Standard API](https://developer.lovense.com/docs/standard-solutions/standard-api), [Standard Socket API](https://developer.lovense.com/docs/standard-solutions/socket-api) y [catálogo oficial](https://www.lovense.com/compare?toyid=hush).
