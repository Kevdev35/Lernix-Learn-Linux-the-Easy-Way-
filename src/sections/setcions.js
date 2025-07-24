// Contenidos de las secciones simuladas
const sections = {
    home: `
        Bienvenido a Lernix 🖥️
        ------------------------
        Esta es una terminal educativa simulada.
        Explora los comandos y aprende Linux sin riesgos.

        Presiona 'help' para ver todos los comandos.
        `,
    commands: `
        Documentación 📚
        ------------------------
        📋 Comandos Disponibles en Linux
        🔧 Comandos Básicos del Sistema

        help - Muestra la ayuda con todos los comandos disponibles
        clear - Limpia la pantalla de la terminal
        reset - Reinicia el sistema de archivos virtual
        exit - Sale de la terminal

        -- Extra (Lernix)
        ------------------------
        about - Información sobre el proyecto Lernix

        📁 Comandos de Navegación y Archivos

        ls - Lista archivos y carpetas (soporta -l para formato largo)
        cd - Cambia de directorio (soporta .., ~)
        pwd - Muestra la ruta actual
        mkdir - Crea una nueva carpeta
        touch - Crea un archivo vacío
        cat - Muestra el contenido de un archivo
        rm - Elimina un archivo
        rmdir - Elimina una carpeta vacía

        ✏️ Comandos de Edición

        echo - Imprime texto (soporta redirección con >)
        nano - Abre el editor de texto simple

        📚 Comandos de Información

        history - Muestra el historial de comandos ejecutados
        whoami - Muestra el usuario actual (edu)
        date - Muestra la fecha y hora actual
        man - Muestra el manual/ayuda de un comando específico

        🔐 Comandos de Administración

        sudo - Ejecuta comandos con privilegios de superusuario

        Soporta sudo apt install <paquete>
        Incluye advertencias para comandos peligrosos

        📝 Notas Especiales:
        Comandos con Parámetros:

        ls -l - Listado detallado
        echo texto > archivo.txt - Redirección a archivo
        cd .. - Directorio padre
        cd ~ - Directorio home
        sudo apt install <paquete> - Instalación simulada

        Editor nano:

        :save - Guardar y salir
        :exit - Salir sin guardar

        Comandos con Validaciones de Seguridad:

        sudo rm -rf --no-preserve-root / - Bloqueado con advertencia crítica

        ¡Prueba los comandos en la terminal!
        `,
    help: `
        Ayuda rápida ⚙️
        ------------------------
        - home     → Muestra la página principal.
        - commands → Muestra los comandos básicos de la terminal.
        - help     → Muestra esta ayuda.
        - version  → Muestra la versión de Lernix.

        Dentro de la terminal usa 'help' para más info.
        `,
    version: `
        Lernix Terminal Emulator
        ------------------------
        Version: 2.0.0
        Developer: Divendey
        `,
    about_linux:`
        Linux es un sistema operativo libre y de código abierto, cuyo núcleo fue creado por Linus Torvalds en 1991.

        🧑‍💻 Historia breve:
        - Creador: Linus Torvalds, estudiante de la Universidad de Helsinki.
        - Inspirado en: UNIX, un sistema robusto para computadoras grandes.
        - Filosofía: Software libre, colaboración global y flexibilidad.
        - Licencia: GNU General Public License (GPL).

        🚀 Distribuciones populares:
        Ubuntu, Debian, Fedora, Arch Linux, CentOS, Linux Mint.

        🎯 Recomendaciones según tu nivel:
        - 👶 Principiantes:
          - Linux Mint: Ideal para usuarios nuevos, muy intuitiva y parecida a Windows.
          - Ubuntu: Amplio soporte, comunidad activa y fácil de usar.
          - Zorin OS: Muy amigable, pensada para quienes migran desde Windows.
        - 🧙‍♂️ Avanzados:
          - Arch Linux: Flexible, ligera, pero requiere conocimientos técnicos.
          - Debian: Estable y robusta, ideal para servidores y usuarios experimentados.
          - Void Linux / Gentoo: Máximo control sobre tu sistema, recomendadas para usuarios expertos.


        🌐 Usos más comunes:
        - Servidores web y bases de datos.
        - Computadoras de escritorio y portátiles.
        - Sistemas embebidos (IoT, routers).
        - Supercomputadoras y centros de datos.
        - Android, el sistema operativo móvil más usado, corre sobre Linux.

        📅 Curiosidades:
        - El pingüino Tux es su mascota oficial.
        - Más del 90% de los supercomputadores usan Linux.
        - Linux se utiliza en la NASA, Google, Amazon, Tesla y otros gigantes tecnológicos.

        🤓 Aprende, experimenta y contribuye. Linux es libertad informática.
    `
};

// Cambiar el contenido del terminal
function changeSection(section) {
  const output = document.getElementById("output");
  if (section === "volver") {
    // Reinicia la terminal
    output.innerText = `Bienvenido a Lernix - Tu primera terminal educativa Linux 🤓
    Escribe 'help' para ver los comandos disponibles.
    `;
  } else {
    output.innerText = sections[section] || "Sección aun en desarrollo.";
  }
}

// Asignar eventos a los botones
document.querySelectorAll(".option").forEach(btn => {
  btn.addEventListener("click", () => {
    const section = btn.innerText.toLowerCase().trim();
    changeSection(section);
  });
});
