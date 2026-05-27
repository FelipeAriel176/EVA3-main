const formLogin = document.getElementById('formLogin');
const usuarioInput = document.getElementById('usuario');
const contrasenaInput = document.getElementById('contrasena');
const mensaje = document.getElementById('mensaje');

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = usuarioInput.value.trim();
  const contrasena = contrasenaInput.value.trim();
  mensaje.innerHTML = '';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify({ usuario, contrasena })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      mensaje.style.color = 'green';
      mensaje.textContent = data.mensaje;
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      mensaje.style.color = 'red';
      mensaje.textContent = data.mensaje || 'Error al intentar iniciar sesión.';
    }
  } catch (error) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Hubo un error de conexión con el servidor.';
  }
});