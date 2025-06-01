const { createCanvas, loadImage, registerFont } = require('canvas');
const StackBlur = require('stackblur-canvas');
const { validarOpciones } = require('./errores');

/**
 * 
 * @param {Object} options
 * @param {string} options.username - Nombre del usuario
 * @param {string} options.avatarURL - URL del avatar del usuario
 * @param {string} options.backgroundURL - URL de la imagen de fondo
 * @param {boolean} options.circularAvatar - Si el avatar debe ser circular
 * @param {boolean} options.showDate - Mostrar la fecha de unión
 * @param {boolean} options.border - Dibujar borde alrededor de la imagen
 * @param {string|string[]} options.borderColor - Color o colores del borde
 * @param {string} options.gradientDirection - Dirección del gradiente ('horizontal', 'vertical', 'diagonal')
 * @param {number} options.maxNameLength - Número máximo de caracteres del nombre
 * @param {string} options.welcomeText - Texto de bienvenida personalizado
 * @param {boolean} options.blurBackground - Aplicar desenfoque al fondo
 * @returns {Promise<Buffer>} Imagen en formato PNG
 */
async function generateWelcomeImage(options) {
    validarOpciones(options);

  const {
    username,
    avatarURL,
    backgroundURL,
    circularAvatar = true,
    showDate = true,
    border = true,
    borderColor = 'rgba(255, 255, 255, 0.56)',
    gradientDirection = 'horizontal',
    maxNameLength = 11,
    welcomeText = 'Bienvenido/a',
    blurBackground = true,
  } = options;

    const width = 727;
    const height = 248;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

  // Fondo redondeado
    const background = await loadImage(backgroundURL);
    const radius = 20;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(background, 0, 0, width, height);

  if (blurBackground) {
    const imageData = ctx.getImageData(0, 0, width, height);
    StackBlur.imageDataRGBA(imageData, 0, 0, width, height, 10); // Radio de blur
    ctx.putImageData(imageData, 0, 0);
  }

  ctx.restore();

  // Borde de la imagen principal con soporte para gradiente
  if (border) {
    ctx.lineWidth = 15;

    let strokeStyle = borderColor;

    if (Array.isArray(borderColor) && borderColor.length >= 2) {
      let gradient;
      switch (gradientDirection) {
        case 'vertical':
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          break;
        case 'diagonal':
          gradient = ctx.createLinearGradient(0, 0, width, height);
          break;
        default:
          gradient = ctx.createLinearGradient(0, 0, width, 0);
      }

      const step = 1 / (borderColor.length - 1);
      borderColor.forEach((color, i) => {
        gradient.addColorStop(i * step, color);
      });

      strokeStyle = gradient;
    }

    ctx.strokeStyle = strokeStyle;

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.stroke();
  }

  // Avatar
    const avatar = await loadImage(avatarURL);
    const avatarSize = 150;
    const avatarX = 50;
    const avatarY = 48;

    ctx.save();
  if (circularAvatar) {
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  } else {
    ctx.beginPath();
    ctx.moveTo(avatarX + radius, avatarY);
    ctx.lineTo(avatarX + avatarSize - radius, avatarY);
    ctx.quadraticCurveTo(avatarX + avatarSize, avatarY, avatarX + avatarSize, avatarY + radius);
    ctx.lineTo(avatarX + avatarSize, avatarY + avatarSize - radius);
    ctx.quadraticCurveTo(avatarX + avatarSize, avatarY + avatarSize, avatarX + avatarSize - radius, avatarY + avatarSize);
    ctx.lineTo(avatarX + radius, avatarY + avatarSize);
    ctx.quadraticCurveTo(avatarX, avatarY + avatarSize, avatarX, avatarY + avatarSize - radius);
    ctx.lineTo(avatarX, avatarY + radius);
    ctx.quadraticCurveTo(avatarX, avatarY, avatarX + radius, avatarY);
    ctx.closePath();
    ctx.clip();
  }
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

  // Nombre de usuario con sombra
    ctx.font = '88px Sans';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 10;

  let displayName = username;
  if (username.length > maxNameLength) {
    displayName = username.slice(0, maxNameLength) + '...';
  }
  ctx.fillText(displayName, avatarX + avatarSize + 30, avatarY + 10);

  // Texto de bienvenida con sombra
    ctx.font = 'bold 32px Sans';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 8;
    ctx.fillText(welcomeText, avatarX + avatarSize + 30, avatarY + 115);


  // Fecha dentro de un cuadro gris con esquinas redondeadas
if (showDate) {
    const dateText = new Date().toLocaleDateString();
    const paddingX = 15;
    const paddingY = 8;
    ctx.font = '16px Sans';
    const textWidth = ctx.measureText(dateText).width;
    const boxWidth = textWidth + paddingX * 2;
    const boxHeight = 32;
    const boxX = width - boxWidth - 20;
    const boxY = height - boxHeight - 20;

  // Desactivar sombra para el fondo
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = 'rgba(70, 70, 70, 0.7)';
    ctx.beginPath();
    ctx.moveTo(boxX + radius, boxY);
    ctx.lineTo(boxX + boxWidth - radius, boxY);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius);
    ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight);
    ctx.lineTo(boxX + radius, boxY + boxHeight);
    ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius);
    ctx.lineTo(boxX, boxY + radius);
    ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateText, boxX + boxWidth / 2, boxY + boxHeight / 2);
}


  return canvas.toBuffer('image/png');
}

module.exports = generateWelcomeImage;
