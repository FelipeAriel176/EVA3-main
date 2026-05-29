# Descripción del proyecto

Este proyecto es una aplicación web llamada HelpDesk Smart Priority. Su objetivo es recibir, ordenar y administrar solicitudes de soporte técnico de una institución educativa.

---

# Tecnologías utilizadas

Backend: Node.js y Express (Servidor y API).

Frontend: HTML5, CSS3 y JavaScript Moderno (Fetch API).

Seguridad: Middleware de autenticación y Express-Session.

Persistencia: Archivo local en formato JSON

---

# Instalación

Para instalar y dejar listo el proyecto en cualquier computadora, abre la terminal y ejecuta:
npm install

--- 

# Ejecución

Para encender el servidor de la aplicación, escribe el siguiente comando en tu terminal:
node app.js

Sabrás que funciona cuando veas el mensaje: Servidor corriendo con éxito en: http://localhost:3000.

---

# Endpoints

POST /api/auth/login - Permite al usuario "felipe" iniciar sesión.

POST /api/auth/logout - Cierra la sesión actual de forma segura.

GET /api/tickets - Muestra la lista completa de solicitudes (Público).

POST /api/tickets - Guarda un nuevo ticket y calcula su prioridad (Protegido).

PUT /api/tickets/:id - Modifica el estado de un ticket por su ID (Protegido).

DELETE /api/tickets/:id - Elimina un ticket del archivo JSON por su ID (Protegido).

--- 

# Ejemplo de uso

1. Ver el panel público 
Abre el navegador e ingresa a http://localhost:3000.

Podrás ver la lista de todos los tickets guardados.

Si intentas presionar el botón "Registrar Nuevo Ticket", el sistema bloqueará la acción y te enviará automáticamente a la pantalla de inicio de sesión por seguridad.

2. Iniciar sesión como Administrador
En la pantalla de login, ingresa el usuario felipe y la contraseña 123.

Presiona el botón "Ingresar".

El sistema validará datos y te redirigirá al panel principal.

3. Registrar una solicitud con prioridad automática
Con la sesión iniciada, haz clic en "Registrar Nuevo Ticket".

Llena el formulario con los datos del problema.

Haz clic en "Enviar Requerimiento".

El backend recibirá los datos, calculará la prioridad de forma automática gracias al algoritmo interno y te mostrará el nuevo caso en la tabla de la página principal.

---

# Explicación de Seguridad HTTPS
1. ¿Qué es HTTPS?
HTTPS es la versión segura del protocolo que usamos para navegar por Internet. Su función principal es encriptar toda la información que viaja entre el navegador del usuario y el servidor backend y así los datos se transforman en un código ilegible para cualquiera que intente interceptarlos.  

2. ¿Qué riesgos ayuda a mitigar?
Ataques de Interceptación: Evita que un tercero metido en la red pueda leer las contraseñas, sesiones o datos personales de los usuarios. Suplantación de identidad: Impide que un atacante clone la página web para engañar al usuario, ya que HTTPS exige certificados de seguridad digitales oficiales que garantizan que el servidor es auténtico.

3. ¿Por qué es importante en aplicaciones web?
Es la base fundamental para garantizar la privacidad ya que en aplicaciones como este proyecto, los usuarios manejan información personal y si no se usara HTTPS, las contraseñas o las sesiones del backend viajarían por la red en texto plano, quedando totalmente expuestas.