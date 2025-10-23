export const cleanSpecialCharacters = (variable: string) => {
    // caracteres especiales
    const esc = [`'`, `%`, `|`, `=`, `<`, `>`, `*`, `/`, `+`, `$`, `?`, `¿`, `¡`, `!`];
  
    const aux = variable.length / 2;
    for (let i = 0; i < aux; i++) {
      esc.forEach(elemento => {
        variable = variable.replace(elemento, ``);
      });
    }
    return variable
  }