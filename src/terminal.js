// Referencias DOM
const output = document.getElementById("output");
const input = document.getElementById("input");

// Estado del sistema
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

// Estado del editor
let inEditor = false;
let editorBuffer = [];
let editorFile = "";

// Configuración de idioma
const getLanguage = () => {
  const lang = navigator.language || "en";
  return lang.startsWith("es");
};

// Mensajes centralizados
const MESSAGES = {
  es: {
    help: `
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
        `,
    systemReset: "Sistema reiniciado.\n",
    folderNotFound: (name) => `No se encontró la carpeta '${name}'\n`,
    folderCreated: (name) => `Carpeta '${name}' creada.\n`,
    folderCreateError: "No se pudo crear la carpeta.\n",
    fileCreated: (name) => `Archivo '${name}' creado.\n`,
    fileCreateError: "No se pudo crear el archivo.\n",
    fileNotFound: (name) => `Archivo '${name}' no encontrado o no es un archivo de texto.\n`,
    fileDeleted: (name) => `Archivo '${name}' eliminado.\n`,
    fileDeleteError: (name) => `No se pudo eliminar '${name}' (¿existe y es archivo?).\n`,
    folderDeleted: (name) => `Carpeta '${name}' eliminada.\n`,
    folderDeleteError: (name) => `No se pudo eliminar '${name}' (¿existe y está vacía?).\n`,
    nanoUsage: "Uso: nano archivo.txt\n",
    noManual: (cmd) => `No hay manual para '${cmd}'.\n`,
    commandNotFound: (cmd) => `Comando no encontrado: ${cmd}\n`,
    exiting: "Saliendo de Lernix... (simulado)\n",
    fileUpdated: (name) => `Archivo '${name}' actualizado.\n`,
    editorEnter: (file) => `\n--- Editando '${file}' ---\nEscribe líneas. Usa ':save' para guardar, ':exit' para salir sin guardar.\n\n`,
    editorSaved: (file) => `\nArchivo '${file}' guardado.\n\n`,
    editorCancelled: "\nEdición cancelada.\n\n",
    about: `
    🖥️  Proyecto: Lernix Terminal Emulator
    📚  Propósito: Aprender comandos de Linux de forma segura, sin distros.
    👨‍💻  Desarrollado por: Divendey
    🛠️  Comandos simulados: ls, cd, mkdir, nano, echo, cat, rm, etc.
    🌐  Emulación: Sistema de archivos virtual con modo editor (nano)
    🧪  Ideal para: estudiantes, autodidactas y cursos introductorios

    ¡Gracias por probar Lernix! Usa 'help' para ver los comandos disponibles.
    `,
    criticalWarning: `
          ⚠️  ADVERTENCIA CRÍTICA: Estás intentando ejecutar 'rm -rf --no-preserve-root /'
          Este comando eliminaría permanentemente todo el sistema Linux, incluyendo archivos del sistema, datos personales y configuraciones.

          ⚠️  En un sistema real, ejecutar esto causaría un daño irreversible.
          ❌  Operación bloqueada en Lernix para proteger tu entorno de aprendizaje.
          `,
    rootWarning: `
              ⚠️  ADVERTENCIA: Estás intentando eliminar el directorio raíz (/).
              Esto destruiría todo tu sistema Linux.

              ❌  Operación abortada por tu seguridad en Lernix.
              `,
    forceWarning: `
              ⚠️  Advertencia: Eliminación forzada de archivos.
              Eliminación simulada completada (ningún archivo real fue afectado).
              `,
    sudoExecuted: (cmd) => `Comando '${cmd}' ejecutado con privilegios de superusuario (simulado).\n`
  },
  en: {
    help: `
        Available commands:
          help          - Show this help
          clear         - Clear screen
          echo [text]   - Print text
          echo [txt] > file.txt - Save text to file
          reset         - Reset Lernix
          ls [-l]       - List files and folders
          cd [folder]   - Change directory
          mkdir [name]  - Create folder
          touch [name]  - Create empty file
          cat [file]    - Show file content
          pwd           - Show current path
          rm [file]     - Delete file
          rmdir [folder] - Delete empty folder
          nano [file]   - Open simple text editor
          history       - Show command history
          whoami        - Show current user
          date          - Show current date and time
          man [command] - Show detailed help
          exit          - Exit (simulated)
        `,
    systemReset: "System reset.\n",
    folderNotFound: (name) => `Folder '${name}' not found\n`,
    folderCreated: (name) => `Folder '${name}' created.\n`,
    folderCreateError: "Could not create folder.\n",
    fileCreated: (name) => `File '${name}' created.\n`,
    fileCreateError: "Could not create file.\n",
    fileNotFound: (name) => `File '${name}' not found or is not a text file.\n`,
    fileDeleted: (name) => `File '${name}' deleted.\n`,
    fileDeleteError: (name) => `Could not delete '${name}' (does it exist and is it a file?).\n`,
    folderDeleted: (name) => `Folder '${name}' deleted.\n`,
    folderDeleteError: (name) => `Could not delete '${name}' (does it exist and is it empty?).\n`,
    nanoUsage: "Usage: nano file.txt\n",
    noManual: (cmd) => `No manual for '${cmd}'.\n`,
    commandNotFound: (cmd) => `Command not found: ${cmd}\n`,
    exiting: "Exiting Lernix... (simulated)\n",
    fileUpdated: (name) => `File '${name}' updated.\n`,
    editorEnter: (file) => `\n--- Editing '${file}' ---\nType lines. Use ':save' to save, ':exit' to exit without saving.\n\n`,
    editorSaved: (file) => `\nFile '${file}' saved.\n\n`,
    editorCancelled: "\nEditing cancelled.\n\n",
    about: `
    🖥️  Project: Lernix Terminal Emulator
    📚  Purpose: Learn Linux commands safely, without installing a distro.
    👨‍💻  Developed by: Divendey 
    🛠️  Simulated commands: ls, cd, mkdir, nano, echo, cat, rm, etc.
    🌐  Emulation: Virtual file system with basic editor mode (nano)
    🧪  Ideal for: students, self-learners, and beginner courses

    Thanks for using Lernix! Type 'help' to see all available commands.
    `,
    criticalWarning: `
          ⚠️  CRITICAL WARNING: You are attempting to run 'rm -rf --no-preserve-root /'
          This command would permanently delete your entire Linux system, including system files, personal data, and configurations.

          ⚠️  On a real system, running this would cause irreversible damage.
          ❌  Operation blocked in Lernix to protect your learning environment.
          `,
    rootWarning: `
              ⚠️  WARNING: You are attempting to remove the root directory (/).
              This would destroy your entire Linux system.

              ❌  Operation aborted for your safety in Lernix.
              `,
    forceWarning: `
              ⚠️  Warning: Forced file deletion.
              Simulated deletion completed (no real files were harmed).
              `,
    sudoExecuted: (cmd) => `Command '${cmd}' executed with superuser privileges (simulated).\n`
  }
};

// Manuales de comandos
const MANUALS = {
  es: {
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
  },
  en: {
    help: "Show list of available commands.",
    clear: "Clear the screen.",
    echo: "Print text to screen or file.",
    reset: "Reset Lernix.",
    ls: "List files and folders. Optional '-l' for long listing.",
    cd: "Change current directory.",
    mkdir: "Create a new folder.",
    touch: "Create an empty file.",
    cat: "Show content of a text file.",
    pwd: "Show current path.",
    rm: "Delete a file.",
    rmdir: "Delete an empty folder.",
    nano: "Simple text editor within Lernix.",
    history: "Show command history.",
    whoami: "Show username.",
    date: "Show current date and time.",
    man: "Show help for commands.",
    exit: "Close terminal (simulated).",
  }
};

// Funciones auxiliares
const msg = (key, ...args) => {
  const lang = getLanguage() ? 'es' : 'en';
  const message = MESSAGES[lang][key];
  return typeof message === 'function' ? message(...args) : message;
};

const getManual = (cmd) => {
  const lang = getLanguage() ? 'es' : 'en';
  return MANUALS[lang][cmd];
};

function getCurrentDir() {
  return currentPath.reduce((dir, folder) => dir[folder], fileSystem);
}

function getCurrentPathStr() {
  return "/" + currentPath.join("/");
}

function promptShow() {
  // Esta función se maneja ahora en el event listener
}

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

// Funciones del editor
function enterEditor(file) {
  inEditor = true;
  editorFile = file;
  const dir = getCurrentDir();
  editorBuffer = dir[file] ? dir[file].split("\n") : [];
  output.innerText += msg('editorEnter', file);
}

function exitEditor(save = false) {
  const dir = getCurrentDir();
  if (save) {
    dir[editorFile] = editorBuffer.join("\n");
    output.innerText += msg('editorSaved', editorFile);
  } else {
    output.innerText += msg('editorCancelled');
  }
  inEditor = false;
  editorBuffer = [];
  editorFile = "";
  promptShow();
}

// Comandos organizados
const COMMANDS = {
  help: () => msg('help'),
  
  clear: () => {
    output.innerText = "";
    return "";
  },
  
  echo: (args) => args.join(" ") + "\n",
  
  reset: () => {
    fileSystem = {
      home: {
        user: {
          "bienvenida.txt": "¡Hola! Esto es Lernix.",
          documentos: {},
        },
      },
    };
    currentPath = ["home", "user"];
    return msg('systemReset');
  },

  ls: (args) => {
    const dir = getCurrentDir();
    const items = Object.entries(dir);

    if (args.includes("-l")) {
      return items.map(([name, value]) => {
        const type = typeof value === "object" ? "dir " : "file";
        const size = typeof value === "string" ? `${value.length}B` : "-";
        return `${type.padEnd(5)} ${name.padEnd(20)} ${size}`;
      }).join("\n") + "\n";
    }
    
    return items.map(([name]) => name).join("  ") + "\n";
  },

  cd: (args) => {
    const dir = getCurrentDir();
    const target = args[0];
    
    if (!target || target === "~") {
      currentPath = ["home", "user"];
    } else if (target === "..") {
      if (currentPath.length > 1) currentPath.pop();
    } else if (dir[target] && typeof dir[target] === "object") {
      currentPath.push(target);
    } else {
      return msg('folderNotFound', target);
    }
    return "";
  },

  mkdir: (args) => {
    const dir = getCurrentDir();
    const name = args[0];
    
    if (name && !dir[name]) {
      dir[name] = {};
      return msg('folderCreated', name);
    }
    return msg('folderCreateError');
  },

  touch: (args) => {
    const dir = getCurrentDir();
    const name = args[0];
    
    if (name && !dir[name]) {
      dir[name] = "";
      return msg('fileCreated', name);
    }
    return msg('fileCreateError');
  },

  cat: (args) => {
    const dir = getCurrentDir();
    const file = args[0];
    
    if (file && typeof dir[file] === "string") {
      return dir[file] + "\n";
    }
    return msg('fileNotFound', file);
  },

  pwd: () => getCurrentPathStr() + "\n",

  rm: (args) => {
    const dir = getCurrentDir();
    const file = args[0];
    
    if (file && typeof dir[file] === "string") {
      delete dir[file];
      return msg('fileDeleted', file);
    }
    return msg('fileDeleteError', file);
  },

  rmdir: (args) => {
    const dir = getCurrentDir();
    const folder = args[0];
    
    if (folder && typeof dir[folder] === "object" && Object.keys(dir[folder]).length === 0) {
      delete dir[folder];
      return msg('folderDeleted', folder);
    }
    return msg('folderDeleteError', folder);
  },

  nano: (args) => {
    const file = args[0];
    if (!file) {
      return msg('nanoUsage');
    }
    enterEditor(file);
    return "";
  },

  history: () => commandHistory.join("\n") + "\n",
  whoami: () => "edu\n",
  date: () => new Date().toString() + "\n",
  about: () => msg('about'),

  man: (args) => {
    const cmd = args[0];
    const manual = getManual(cmd);
    
    if (manual) {
      return `${cmd} - ${manual}\n`;
    }
    return msg('noManual', cmd);
  },

  exit: () => {
    input.disabled = true;
    return msg('exiting');
  },

  sudo: (args) => {
    if (args.length === 0) {
        return "Usage: sudo <command>\n";
    }
    
    const sudoCommand = args.join(" ").trim();
    
    // Verificar comandos peligrosos primero
    if (sudoCommand === 'rm -rf --no-preserve-root /') {
        return msg('criticalWarning');
    }
    
    // Manejar apt install
    if (args[0] === "apt" && args[1] === "install") {
        if (!args[2]) {
            return "Usage: sudo apt install <package>\n";
        }
        const packageName = args.slice(2).join(" ");
        return `Package ${packageName} installed successfully (simulated).\n`;
    }
    
    return `Command '${sudoCommand}' executed with superuser privileges (simulated).\n`;
  }


};

// Función principal optimizada
function executeCommand(base, args) {
  const command = COMMANDS[base];
  
  if (command) {
    const result = command(args);
    if (result) {
      output.innerText += result;
    }
  } else {
    output.innerText += msg('commandNotFound', base);
  }
}

// Función principal de procesamiento
function processCommand(cmd) {
  // Manejar editor
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

  // Comando vacío
  if (cmd.trim() === "") {
    return;
  }

  // Guardar en historial
  commandHistory.push(cmd);
  historyIndex = commandHistory.length;

  // Manejar echo con redirección
  if (cmd.startsWith("echo ") && cmd.includes(">")) {
    const parts = cmd.split(">");
    const content = parts[0].replace("echo ", "").trim();
    const filename = parts[1].trim();
    const dir = getCurrentDir();
    dir[filename] = content;
    output.innerText += msg('fileUpdated', filename);
    return;
  }

  // Parsear comando
  const parts = cmd.trim().split(" ");
  const base = parts[0];
  const args = parts.slice(1);

  // Ejecutar comando
  executeCommand(base, args);
}

// Event listener optimizado
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const command = input.value.trim();
    
    // Mostrar prompt solo si no estamos en editor
    if (!inEditor) {
      output.innerText += `edu@linux:~$ ${command}\n`;
    }
    
    input.value = "";
    processCommand(command);
    scrollToBottom();
  } else if (!inEditor) {
    // Navegación por historial con flechas
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex] || "";
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex] || "";
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
    }
  }
});



// Inicialización
scrollToBottom();