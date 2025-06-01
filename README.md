
<h1>🎉 Discord-welcome-image</h1>
Genera imágenes de bienvenida personalizadas para bots, servidores o comunidades. Este módulo permite crear imágenes con avatares, textos personalizados, bordes y efectos visuales como desenfoque y gradientes.

<br><br>

[![Discord](https://img.shields.io/badge/Discord-Unete%20al%20Servidor-5865F2?logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/tGxgqxj7fM) <a href="https://www.npmjs.com/package/discord-welcome-image"><img src="https://img.shields.io/npm/v/discord-welcome-image.svg?style=flat&label=npm" /></a>
<a href="https://www.npmjs.com/package/discord-welcome-image"><img src="https://img.shields.io/npm/dt/discord-welcome-image?style=flat&label=Downloads" /></a>

<br><br>

📦 Instalación

```bash
npm i discord-welcome-image
```

<br><br>

📋 Opciones
| Opción              | Tipo                                       | Descripción                                                             |                                                                  |
| ------------------- | ------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `username`          | `string`                                   | Nombre del usuario que será mostrado en la imagen                       |                                                                  |
| `avatarURL`         | `string`                                   | URL de la imagen de avatar del usuario                                  |                                                                  |
| `backgroundURL`     | `string`                                   | URL de la imagen de fondo                                               |                                                                  |
| `circularAvatar`    | `boolean`                                  | Si el avatar debe ser circular (por defecto: `true`)                    |                                                                  |
| `showDate`          | `boolean`                                  | Si se debe mostrar la fecha de creación (por defecto: `true`)           |                                                                  |
| `border`            | `boolean`                                  | Si debe dibujarse un borde en la imagen (por defecto: `true`)           |                                                                  |
| `borderColor`       | `string`                                                                                                | Color del borde (hex, rgba, o arreglo de colores para gradiente) |
| `gradientDirection` | `string` | Dirección del gradiente si hay varios colores en `borderColor`, horizontal, vertical y diagonal.          |                                                                  |
| `maxNameLength`     | `number`                                   | Número máximo de caracteres para mostrar del nombre (por defecto: `20`) |                                                                  |
| `welcomeText`       | `string`                                   | Texto de bienvenida personalizado (por defecto: `'Bienvenido/a'`)       |                                                                  |
| `blurBackground`    | `boolean`                                  | Si se debe aplicar desenfoque al fondo (por defecto: `true`)            |                                                                  |

<br><br>

🛠 Uso básico
```js
const { AttachmentBuilder } = require('discord.js');
const generateWelcomeImage = require('generate-welcome-image');

const WELCOME_CHANNEL_ID = '1234567890101112';

client.on('guildMemberAdd', async member => {
  const welcomeBuffer = await generateWelcomeImage({
    username: member.user.username,
    avatarURL: member.user.displayAvatarURL({ extension: 'png', size: 512 }),
    backgroundURL: 'https://www.shutterstock.com/image-vector/sky-clouds-anime-background-cloudy-600nw-2430402851.jpg',
    circularAvatar: true,
    showDate: true,
    border: true,
    borderColor: ['#00ff00', '#ff00ff'], // Gradiente
    gradientDirection: 'diagonal',
    maxNameLength: 12,
    welcomeText: '¡Bienvenido al servidor!',
    blurBackground: true
  });

  const attachment = new AttachmentBuilder(welcomeBuffer, { name: 'welcome.png' });

  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (channel) {
    channel.send({ files: [attachment], content: `🎉 ¡Bienvenido/a <@${member.id}>!` });
  }
});

```

<br><br>

![Ejemplo de bienvenida](https://media.discordapp.net/attachments/1054041270894465127/1378768677939318874/welcome.png?ex=683dcde5&is=683c7c65&hm=492b8bd2593de1b8522c84c65b265bc5ae2ab657705937a159720efb25def116&=&format=webp&quality=lossless)
