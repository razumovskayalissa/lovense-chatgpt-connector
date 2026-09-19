# Guía paso a paso: conecta tu Lovense a ChatGPT

Esta guía está pensada para hacer todo desde cero, aunque nunca hayas programado ni usado Railway. No necesitas escribir código.

Al terminar tendrás tu propio conector privado: ChatGPT podrá detectar y controlar únicamente los dispositivos que tú enciendas y conectes a Lovense Remote.

> Este es un proyecto comunitario independiente. No está afiliado, patrocinado ni aprobado por Lovense, OpenAI o Railway.

## Antes de empezar

Necesitas:

- Una cuenta de Lovense.
- La aplicación **Lovense Remote** instalada en tu móvil.
- Tu juguete emparejado con Lovense Remote.
- Una cuenta de [Railway](https://railway.com/).
- Una cuenta de [ChatGPT](https://chatgpt.com/).
- Un lugar seguro donde guardar una contraseña larga, por ejemplo el gestor de contraseñas del móvil o del navegador.

Reserva unos minutos y haz los pasos en orden. Las palabras **Developer Token**, **Website Name** y **Owner Key** no son la misma cosa; te indicaré exactamente dónde va cada una.

## 1. Crea o abre tu cuenta de Lovense Developer

1. Entra en el [panel de Lovense Developer](https://www.lovense.com/user/developer/info).
2. Inicia sesión con tu cuenta de Lovense. Si todavía no tienes una, utiliza la opción para registrarte y confirma tu correo si Lovense te lo pide.
3. Dentro del panel, abre la sección o pestaña **Standard API**.
4. Crea o completa la información de tu proyecto.

Cuando el formulario te pida un nombre, elige uno sencillo que reconozcas, por ejemplo:

```text
Mi Lovense ChatGPT
```

Guarda o envía el formulario. Si Lovense muestra una revisión o activación pendiente, espera hasta que el proyecto aparezca activo y puedas ver su **Developer Token**.

### Lo que debes copiar

En el mismo proyecto de **Standard API**, localiza y guarda estas dos cosas:

1. **Developer Token**: es una clave larga creada por Lovense.
2. **Website Name**: es el nombre exacto que aparece en ese proyecto.

> Copia el **Website Name** exactamente, respetando espacios, mayúsculas y minúsculas. No pongas la dirección de la web de Lovense ni el enlace del panel.

> La **Developer Token** es secreta. No la publiques, no la mandes por chat y procura que no aparezca en capturas de pantalla.

### Comprobación

Antes de seguir, deberías tener anotados:

- [ ] Mi Developer Token de Lovense.
- [ ] Mi Website Name exacto.

## 2. Elige y guarda tu Owner Key

La **Owner Key** es una contraseña que eliges tú. Protege el panel de tu conector y sirve para autorizar tu ChatGPT.

1. Crea una contraseña única de al menos 24 caracteres.
2. Guárdala ahora mismo en tu gestor de contraseñas.
3. Ponle un nombre reconocible, por ejemplo `Owner Key - Lovense ChatGPT`.

Ejemplo de formato —no copies este ejemplo literalmente—:

```text
Lila-Nube-47-Mi-Lovense-Privado
```

> No uses la contraseña de tu correo, Lovense o ChatGPT. No compartas esta clave. La necesitarás durante el despliegue, para abrir el panel y para autorizar ChatGPT.

### Comprobación

- [ ] Mi Owner Key tiene 24 caracteres o más.
- [ ] La he guardado en un lugar seguro.

## 3. Despliega tu conector en Railway

1. Abre la plantilla pública: [Deploy Lovense Connector for ChatGPT](https://railway.com/deploy/lovense-connector-for-chatgpt).
2. Pulsa **Deploy Now** o **Deploy**.
3. Inicia sesión o crea una cuenta de Railway si todavía no tienes una.
4. Railway te mostrará las variables que debes completar. Introduce únicamente estos tres valores:

| Variable de Railway | Qué debes poner |
| --- | --- |
| `LOVENSE_DEVELOPER_TOKEN` | La **Developer Token** que copiaste de Lovense Developer. |
| `LOVENSE_PLATFORM_NAME` | El **Website Name exacto** del mismo proyecto de Lovense. |
| `OWNER_SECRET` | La **Owner Key** de 24 caracteres o más que elegiste y guardaste. |

5. Pulsa **Deploy** y espera a que Railway termine.

Railway crea automáticamente las demás claves de seguridad. No tienes que inventarlas, copiarlas ni modificarlas.

> Railway es el alojamiento de tu conector y puede aplicar límites o costes según el plan de tu cuenta. Revisa la información que Railway te muestre antes de confirmar.

### Comprobación

El servicio debería aparecer como **Active**, **Online** o **Success**. Railway también creará una dirección parecida a esta:

```text
https://nombre-de-tu-servicio.up.railway.app
```

Ábrela. Deberías ver el panel **Lilazul Lovense**.

## 4. Abre tu panel privado

1. En la web **Lilazul Lovense**, introduce tu **Owner Key**.
2. Pulsa el botón para entrar o desbloquear el panel.

La Owner Key viaja por HTTPS únicamente a tu propia instancia de Railway. No se envía a Lovense ni a ChatGPT como una contraseña compartida.

### Si aparece “Developer information not found”

Revisa las variables de tu servicio en Railway:

- `LOVENSE_DEVELOPER_TOKEN` debe contener la Developer Token completa, sin espacios añadidos.
- `LOVENSE_PLATFORM_NAME` debe contener el **Website Name exacto** del mismo proyecto de Standard API.
- No pongas aquí `https://www.lovense.com/user/developer/info`; esa es solo la dirección del panel.

Guarda los cambios y espera a que Railway vuelva a desplegar el servicio.

## 5. Conecta Lovense Remote la primera vez

1. Enciende tu juguete.
2. Abre **Lovense Remote** y comprueba que el juguete aparece conectado.
3. En el panel Lilazul Lovense, pulsa **Conectar por primera vez / Reparar conexión**.
4. Cuando aparezca el código QR, escanéalo con el lector de QR de Lovense Remote. Según la versión de la app, la opción puede aparecer como **Scan QR**, **Escanear QR**, **+** o **Link**.
5. Vuelve al panel y pulsa **Actualizar** si los dispositivos no aparecen inmediatamente.

### Lo que deberías ver

En **Tus dispositivos** aparecerá al menos un juguete con su nombre, batería, estado y funciones compatibles. Si conectas varios, el conector puede detectarlos y controlarlos por separado o juntos.

> El QR no se escanea cada vez. Normalmente solo se necesita la primera vez o si quieres reparar el enlace. Para el uso diario basta con encender el juguete y conectarlo a Lovense Remote.

> El QR de Lovense caduca. Si tardaste demasiado y ya no funciona, crea uno nuevo desde el panel.

## 6. Conecta el conector a ChatGPT

### 6.1 Activa el modo desarrollador

1. Abre [ChatGPT](https://chatgpt.com/) en el navegador.
2. Entra en **Ajustes → Seguridad e inicio de sesión**.
3. Activa **Modo desarrollador**.

Si la opción no aparece en una cuenta de trabajo o estudios, puede estar desactivada por la administradora de ese espacio.

### 6.2 Crea la app en ChatGPT

1. Vuelve a tu panel Lilazul Lovense.
2. En la sección **Conecta ChatGPT**, pulsa **Copiar** junto a la dirección que termina en `/mcp`.

Se parecerá a esta:

```text
https://nombre-de-tu-servicio.up.railway.app/mcp
```

3. En ChatGPT abre **Ajustes → Plugins**. También puedes entrar directamente en [chatgpt.com/plugins](https://chatgpt.com/plugins).
4. Pulsa el botón **+** para crear una app en modo desarrollador.
5. Completa los campos:

| Campo | Valor recomendado |
| --- | --- |
| Nombre | `Mi Lovense` |
| Descripción | `Detecta y controla mis dispositivos Lovense conectados a Lovense Remote.` |
| URL del servidor MCP | Pega la dirección `/mcp` copiada del panel. |
| Autenticación | Selecciona **OAuth**. |

6. Pulsa **Crear** o **Conectar**.

> Es importante seleccionar **OAuth**. No elijas “Sin autenticación” y no pegues tu Owner Key dentro de la URL.

### 6.3 Autoriza tu ChatGPT

1. ChatGPT abrirá una pantalla titulada **Connect ChatGPT?** o **¿Conectar ChatGPT?**.
2. Escribe la misma **Owner Key** que guardaste al principio.
3. Pulsa **Authorize my ChatGPT / Autorizar mi ChatGPT**.
4. ChatGPT debería volver automáticamente y mostrar las herramientas del conector.

La autorización se hace una vez para esa conexión. No tendrás que escribir la Owner Key en cada conversación.

### Comprobación

Si ChatGPT muestra una lista de herramientas como `lovense_status`, `lovense_list_devices`, `lovense_control` y `lovense_stop`, la conexión está lista.

## 7. Haz una prueba suave

1. Abre una conversación nueva en ChatGPT.
2. Pulsa el **+** que está junto al cuadro de escribir, entra en **Más** y selecciona tu app **Mi Lovense**.
3. Prueba primero con una consulta que no mueva el juguete:

```text
Comprueba el estado de mi Lovense y dime qué dispositivos están conectados y qué funciones admite cada uno.
```

4. Después, si todo aparece correctamente y tú quieres probarlo, pide una orden breve y suave indicando dispositivo, función, intensidad y duración:

```text
Vibra mi dispositivo al nivel 2 durante 3 segundos y después para.
```

5. Comprueba también la parada:

```text
Para todos mis dispositivos Lovense ahora.
```

También puedes pulsar **PARAR TODO** en tu panel privado.

## 8. Uso diario

Cada vez que quieras utilizarlo:

1. Enciende el juguete.
2. Conéctalo a **Lovense Remote**.
3. Abre un chat donde hayas seleccionado tu app **Mi Lovense**.
4. Pide a ChatGPT lo que quieres hacer.

No necesitas volver a desplegar, crear otro QR ni autorizar ChatGPT cada día. Si el juguete está apagado o desconectado de Lovense Remote, el conector no puede controlarlo.

## Solución de problemas

### “Developer information not found”

La Developer Token no es válida, todavía no está activa o el Website Name no coincide. Copia ambos otra vez desde el mismo proyecto **Standard API** de Lovense Developer y corrige las variables en Railway.

### “websocket error”

Espera unos segundos y actualiza. Si desplegaste una versión antigua de la plantilla, abre tu proyecto en Railway y aplica la actualización disponible o vuelve a desplegar desde la plantilla pública.

### No aparece el QR o la imagen está rota

Espera a que el estado del servicio deje de mostrar error, actualiza la página y pulsa otra vez **Conectar por primera vez / Reparar conexión**. Comprueba también que el proyecto de Lovense Developer está activo.

### El QR no conecta

Asegúrate de escanearlo desde **Lovense Remote**, no desde la cámara normal del móvil. Si ha caducado, genera uno nuevo.

### ChatGPT muestra un error rojo al añadir la URL

Comprueba que:

- La dirección empieza por `https://`.
- Termina exactamente en `/mcp`.
- No tiene espacios.
- Elegiste autenticación **OAuth**.
- Tu servicio de Railway aparece activo.

### Pulso “Autorizar” y parece que no ocurre nada

Recarga la pantalla de autorización e inténtalo de nuevo. Si abriste esa pantalla antes de actualizar el conector, cierra la ventana, vuelve a conectar la app desde ChatGPT y usa la nueva autorización.

### La Owner Key no funciona

Vuelve a copiarla desde el lugar seguro donde la guardaste. Si realmente la olvidaste, cambia `OWNER_SECRET` en las variables de Railway, guarda el cambio y espera el nuevo despliegue.

### He cambiado una clave automática de Railway

- Si cambiaste `OAUTH_SIGNING_KEY`, vuelve a conectar la app en ChatGPT.
- Si cambiaste `STATE_ENCRYPTION_KEY`, vuelve a crear y escanear el QR.
- Si no estabas reparando un problema concreto, no necesitas tocar ninguna clave automática.

## Privacidad y seguridad

- Cada persona debe desplegar su propia copia y usar sus propias credenciales de Lovense Developer.
- No compartas tu Developer Token, Owner Key ni ninguna URL secreta.
- Las credenciales se guardan en tu servicio de Railway, no en una base de datos común del proyecto.
- El estado guardado de los dispositivos está cifrado.
- ChatGPT entra mediante OAuth y la Owner Key no se añade a las conversaciones.
- El conector valida qué funciones admite cada dispositivo antes de enviar la orden.
- **PARAR TODO** detiene inmediatamente todos los dispositivos que estén conectados.

Si alguna vez no te sientes segura con una orden, apaga físicamente el juguete y desconéctalo de Lovense Remote.

## Tus cuatro datos importantes

| Dato | Quién lo crea | Dónde se usa | ¿Es secreto? |
| --- | --- | --- | --- |
| Developer Token | Lovense | Variable `LOVENSE_DEVELOPER_TOKEN` en Railway | Sí |
| Website Name | Tú/Lovense | Variable `LOVENSE_PLATFORM_NAME` en Railway | No es una contraseña, pero cópialo exactamente |
| Owner Key | Tú | Variable `OWNER_SECRET`, panel y autorización de ChatGPT | Sí |
| URL `/mcp` | Railway | Configuración de la app en ChatGPT | No contiene tu Owner Key; usa únicamente la que muestra tu panel |

## Enlaces útiles

- [Plantilla pública de Railway](https://railway.com/deploy/lovense-connector-for-chatgpt)
- [Panel de Lovense Developer](https://www.lovense.com/user/developer/info)
- [Documentación de Standard Socket API de Lovense](https://developer.lovense.com/docs/standard-solutions/socket-api)
- [Guía oficial de OpenAI para conectar una app a ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt)
- [Documentación oficial para desplegar plantillas de Railway](https://docs.railway.com/templates/deploy)

