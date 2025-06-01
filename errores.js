function esColorValido(valor) {
  return typeof valor === 'string' && (
    /^#([0-9A-Fa-f]{3}){1,2}$/.test(valor) || // #RGB o #RRGGBB
    /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(,\s*\d+(\.\d+)?\s*)?\)$/.test(valor)
  );
}

function esURLValida(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validarOpciones(options) {
  if (typeof options !== 'object' || options === null) {
    throw new TypeError(`❌ Las opciones deben ser un objeto, pero recibiste: ${typeof options}`);
  }

  const definiciones = {
    username: 'string',
    avatarURL: 'string',
    backgroundURL: 'string',
    circularAvatar: 'boolean',
    showDate: 'boolean',
    border: 'boolean',
    borderColor: ['string', 'object'], // puede ser string o array
    gradientDirection: 'string',
    maxNameLength: 'number',
    welcomeText: 'string',
    blurBackground: 'boolean',
  };

  const valoresPermitidos = {
    gradientDirection: ['horizontal', 'vertical', 'diagonal']
  };

  for (const clave in definiciones) {
    const tiposEsperados = Array.isArray(definiciones[clave]) ? definiciones[clave] : [definiciones[clave]];
    const valor = options[clave];

    if (valor === undefined) continue;

    const tipoReal = Array.isArray(valor) ? 'object' : typeof valor;

    if (!tiposEsperados.includes(tipoReal)) {
      throw new TypeError(`❌ La opción '${clave}' debe ser del tipo ${tiposEsperados.join(' o ')}, pero recibiste: ${tipoReal}`);
    }

    // Validaciones específicas
    if (clave === 'gradientDirection' && valor) {
      if (!valoresPermitidos.gradientDirection.includes(valor)) {
        throw new TypeError(`❌ '${clave}' debe ser uno de: ${valoresPermitidos.gradientDirection.join(', ')}, pero recibiste: '${valor}'`);
      }
    }

    if ((clave === 'avatarURL' || clave === 'backgroundURL') && !esURLValida(valor)) {
      throw new TypeError(`❌ '${clave}' debe ser una URL válida, pero recibiste: '${valor}'`);
    }

    if (clave === 'borderColor') {
      if (Array.isArray(valor)) {
        for (const color of valor) {
          if (!esColorValido(color)) {
            throw new TypeError(`❌ Uno de los colores en 'borderColor' no es válido: '${color}'`);
          }
        }
      } else if (!esColorValido(valor)) {
        throw new TypeError(`❌ 'borderColor' debe ser un color válido en formato '#hex' o 'rgba()', pero recibiste: '${valor}'`);
      }
    }
  }
}

module.exports = { validarOpciones };
