const output = document.getElementById("output");
const input = document.getElementById("input");

let fileSystem = {
  home: {
    user: {
      "bienvenida.txt": "¡Hola! Esto es Lernix.",
      documentos: {},
    },
  },
};
let currentPath = ["home", "user"];
let commandHistory = [];
let historyIndex = -1;

let inEditor = false;
let editorBuffer = [];
let editorFile = "";

function getCurrentDir() {
  return currentPath.reduce((dir, folder) => dir[folder], fileSystem);
}

function getCurrentPathStr() {
  return "/" + currentPath.join("/");
}

function enterEditor(file) {
  inEditor = true;
  editorFile = file;
  const dir = getCurrentDir();
  editorBuffer = dir[file] ? dir[file].split("\n") : [];
  output.innerText += `\n--- Editando '${file}' ---\nEscribe líneas. Usa ':save' para guardar, ':exit' para salir sin guardar.\n\n`;
}

function exitEditor(save = false) {
  const dir = getCurrentDir();
  if (save) {
    dir[editorFile] = editorBuffer.join("\n");
    output.innerText += `\nArchivo '${editorFile}' guardado.\n\n`;
  } else {
    output.innerText += `\nEdición cancelada.\n\n`;
  }
  inEditor = false;
  editorBuffer = [];
  editorFile = "";
  promptShow();
}

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

function processCommand(cmd) {
  if (inEditor) {
    if (cmd === ":save") {
      exitEditor(true);
    } else if (cmd === ":exit") {
      exitEditor(false);
    } else {
      editorBuffer.push(cmd);
      output.innerText += cmd + "\n";
      scrollToBottom();
    }
    return;
  }

  if (cmd.trim() === "") {
    promptShow();
    return;
  }

  // Guardar en historial
  commandHistory.push(cmd);
  historyIndex = commandHistory.length;

  // Detectar echo > para escribir archivo
  if (cmd.startsWith("echo ") && cmd.includes(">")) {
    const parts = cmd.split(">");
    const content = parts[0].replace("echo ", "").trim();
    const filename = parts[1].trim();
    const dir = getCurrentDir();
    dir[filename] = content;
    output.innerText += `Archivo '${filename}' actualizado.\n`;
    promptShow();
    return;
  }

  const parts = cmd.trim().split(" ");
  const base = parts[0];
  const args = parts.slice(1);

  switch (base) {
    case "help":
      output.innerText += `
        Comandos disponibles:
          help          - Muestra esta ayuda
          clear         - Limpia pantalla
          echo [texto]  - Imprime texto
          echo [txt] > archivo.txt - Guarda texto en archivo
          reset         - Reinicia Lernix
          ls [-l]       - Lista archivos y carpetas
          cd [carpeta]  - Cambia de carpeta
          mkdir [name]  - Crea carpeta
          touch [name]  - Crea archivo vacío
          cat [archivo] - Muestra contenido archivo
          pwd           - Muestra ruta actual
          rm [archivo]  - Elimina archivo
          rmdir [carpeta] - Elimina carpeta vacía
          nano [archivo] - Abre editor de texto simple
          history       - Muestra historial de comandos
          whoami        - Muestra usuario actual
          date          - Muestra fecha y hora actual
          man [comando] - Muestra ayuda detallada
          exit          - Salir (simulado)
        `;
      break;

    case "clear":
      output.innerText = "";
      break;

    case "echo":
      output.innerText += args.join(" ") + "\n";
      break;

    case "reset":
      fileSystem = {
        home: {
          user: {
            "bienvenida.txt": "¡Hola! Esto es Lernix.",
            documentos: {},
          },
        },
      };
      currentPath = ["home", "user"];
      output.innerText += "Sistema reiniciado.\n";
      break;

    case "ls": {
      const dir = getCurrentDir();
      const items = Object.entries(dir);

      if (args.includes("-l")) {
        items.forEach(([name, value]) => {
          const type = typeof value === "object" ? "dir " : "file";
          const size = typeof value === "string" ? `${value.length}B` : "-";
          output.innerText += `${type.padEnd(5)} ${name.padEnd(20)} ${size}\n`;
        });
      } else {
        const names = items.map(([name]) => name);
        output.innerText += names.join("  ") + "\n";
      }
      break;
    }

    case "sudo": {
      const lang = navigator.language || "en";
      const isSpanish = lang.startsWith("es");
      const sudoCommand = args.join(" ").trim();

      if (sudoCommand === "rm -rf --no-preserve-root /" || sudoCommand.includes("rm -rf --no-preserve-root /")) {
        output.innerText += isSpanish
          ? `
          ⚠️  ADVERTENCIA CRÍTICA: Estás intentando ejecutar 'rm -rf --no-preserve-root /'
          Este comando eliminaría permanentemente todo el sistema Linux, incluyendo archivos del sistema, datos personales y configuraciones.

          ⚠️  En un sistema real, ejecutar esto causaría un daño irreversible.
          ❌  Operación bloqueada en Lernix para proteger tu entorno de aprendizaje.
          `
                : `
          ⚠️  CRITICAL WARNING: You are attempting to run 'rm -rf --no-preserve-root /'
          This command would permanently delete your entire Linux system, including system files, personal data, and configurations.

          ⚠️  On a real system, running this would cause irreversible damage.
          ❌  Operation blocked in Lernix to protect your learning environment.
          `;
            } else if (sudoCommand.startsWith("rm -rf /")) {
              output.innerText += isSpanish
                ? `
              ⚠️  ADVERTENCIA: Estás intentando eliminar el directorio raíz (/).
              Esto destruiría todo tu sistema Linux.

              ❌  Operación abortada por tu seguridad en Lernix.
              `
                    : `
              ⚠️  WARNING: You are attempting to remove the root directory (/).
              This would destroy your entire Linux system.

              ❌  Operation aborted for your safety in Lernix.
              `;
                } else if (sudoCommand.startsWith("rm -f")) {
                  output.innerText += isSpanish
                    ? `
              ⚠️  Advertencia: Eliminación forzada de archivos.
              Eliminación simulada completada (ningún archivo real fue afectado).
              `
                    : `
              ⚠️  Warning: Forced file deletion.
              Simulated deletion completed (no real files were harmed).
              `;
            } else {
              output.innerText += isSpanish
                ? `Comando '${sudoCommand}' ejecutado con privilegios de superusuario (simulado).\n`
                : `Command '${sudoCommand}' executed with superuser privileges (simulated).\n`;
            }
            break;
    }



    case "cd": {
      const dir = getCurrentDir();
      const target = args[0];
      if (!target || target === "~") {
        currentPath = ["home", "user"];
      } else if (target === "..") {
        if (currentPath.length > 1) currentPath.pop();
      } else if (dir[target] && typeof dir[target] === "object") {
        currentPath.push(target);
      } else {
        output.innerText += `No se encontró la carpeta '${target}'\n`;
      }
      break;
    }

    case "mkdir": {
      const dir = getCurrentDir();
      const name = args[0];
      if (name && !dir[name]) {
        dir[name] = {};
        output.innerText += `Carpeta '${name}' creada.\n`;
      } else {
        output.innerText += `No se pudo crear la carpeta.\n`;
      }
      break;
    }

    case "touch": {
      const dir = getCurrentDir();
      const name = args[0];
      if (name && !dir[name]) {
        dir[name] = "";
        output.innerText += `Archivo '${name}' creado.\n`;
      } else {
        output.innerText += `No se pudo crear el archivo.\n`;
      }
      break;
    }

    case "cat": {
      const dir = getCurrentDir();
      const file = args[0];
      if (file && typeof dir[file] === "string") {
        output.innerText += dir[file] + "\n";
      } else {
        output.innerText += `Archivo '${file}' no encontrado o no es un archivo de texto.\n`;
      }
      break;
    }

    case "pwd":
      output.innerText += getCurrentPathStr() + "\n";
      break;

    case "rm": {
      const dir = getCurrentDir();
      const file = args[0];
      if (file && typeof dir[file] === "string") {
        delete dir[file];
        output.innerText += `Archivo '${file}' eliminado.\n`;
      } else {
        output.innerText += `No se pudo eliminar '${file}' (¿existe y es archivo?).\n`;
      }
      break;
    }

    case "rmdir": {
      const dir = getCurrentDir();
      const folder = args[0];
      if (folder && typeof dir[folder] === "object" && Object.keys(dir[folder]).length === 0) {
        delete dir[folder];
        output.innerText += `Carpeta '${folder}' eliminada.\n`;
      } else {
        output.innerText += `No se pudo eliminar '${folder}' (¿existe y está vacía?).\n`;
      }
      break;
    }

    case "nano": {
      const file = args[0];
      if (!file) {
        output.innerText += "Uso: nano archivo.txt\n";
      } else {
        enterEditor(file);
      }
      break;
    }

    case "history":
      output.innerText += commandHistory.join("\n") + "\n";
      break;

    case "whoami":
      output.innerText += "edu\n";
      break;

    case "date":
      output.innerText += new Date().toString() + "\n";
      break;

    case "man": {
      const c = args[0];
      const manuals = {
        help: "Muestra la lista de comandos disponibles.",
        clear: "Limpia la pantalla.",
        echo: "Imprime texto en pantalla o en archivo.",
        reset: "Reinicia Lernix.",
        ls: "Lista archivos y carpetas. Opcional '-l' para listado largo.",
        cd: "Cambia la carpeta actual.",
        mkdir: "Crea una nueva carpeta.",
        touch: "Crea un archivo vacío.",
        cat: "Muestra contenido de un archivo de texto.",
        pwd: "Muestra la ruta actual.",
        rm: "Elimina un archivo.",
        rmdir: "Elimina una carpeta vacía.",
        nano: "Editor de texto simple dentro de Lernix.",
        history: "Muestra el historial de comandos.",
        whoami: "Muestra el nombre del usuario.",
        date: "Muestra la fecha y hora actuales.",
        man: "Muestra ayuda para comandos.",
        exit: "Cierra la terminal (simulado).",
      };
      if (manuals[c]) {
        output.innerText += `${c} - ${manuals[c]}\n`;
      } else {
        output.innerText += `No hay manual para '${c}'.\n`;
      }
      break;
    }

    case "about": {
    const lang = navigator.language || "en";
    const isSpanish = lang.startsWith("es");

    const message = isSpanish
        ? `
    🖥️  Proyecto: Lernix Terminal Emulator
    📚  Propósito: Aprender comandos de Linux de forma segura, sin distros.
    👨‍💻  Desarrollado por: Divendey
    🛠️  Comandos simulados: ls, cd, mkdir, nano, echo, cat, rm, etc.
    🌐  Emulación: Sistema de archivos virtual con modo editor (nano)
    🧪  Ideal para: estudiantes, autodidactas y cursos introductorios

    ¡Gracias por probar Lernix! Usa 'help' para ver los comandos disponibles.
    `
        : `
    🖥️  Project: Lernix Terminal Emulator
    📚  Purpose: Learn Linux commands safely, without installing a distro.
    👨‍💻  Developed by: Divendey 
    🛠️  Simulated commands: ls, cd, mkdir, nano, echo, cat, rm, etc.
    🌐  Emulation: Virtual file system with basic editor mode (nano)
    🧪  Ideal for: students, self-learners, and beginner courses

    Thanks for using Lernix! Type 'help' to see all available commands.
    `;

    output.innerText += message;
    break;
    }

    case "exit":
      output.innerText += "Saliendo de Lernix... (simulado)\n";
      input.disabled = true;
      break;

    default:
      output.innerText += `Comando no encontrado: ${base}\n`;
  }
  if (!inEditor) promptShow();
}

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const command = input.value.trim();
    if (!inEditor) {
      output.innerText += `edu@linux:~$ ${command}\n`;
    }
    input.value = "";
    processCommand(command);
    scrollToBottom();
  } else if (!inEditor) {
    // Navegación por historial con flechas
    if (event.key === "ArrowUp") {
      if (historyIndex > 0) historyIndex--;
      input.value = commandHistory[historyIndex] || "";
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) historyIndex++;
      else historyIndex = commandHistory.length;
      input.value = commandHistory[historyIndex] || "";
      event.preventDefault();
    }
  }
});

scrollToBottom();
