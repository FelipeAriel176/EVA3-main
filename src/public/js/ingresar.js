const formTicket = document.getElementById('formTicket');
const mensaje = document.getElementById('mensaje');
const btnVolver = document.getElementById('btnVolver');

btnVolver.addEventListener('click', () => { window.location.href = 'index.html'; });

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/auth/perfil', { credentials: 'include' });
    const data = await response.json();

    if (!data.ok) {
      mensaje.innerHTML = `<p style="color:red; font-weight:bold;">Acceso denegado: Debes iniciar sesión para crear un ticket.</p>`;
      formTicket.style.display = 'none';
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    }
  } catch (error) {
    mensaje.innerHTML = '<p style="color:red;">Error al validar la sesión activa.</p>';
    formTicket.style.display = 'none';
  }
});

formTicket.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombreSolicitante = document.getElementById('nombreSolicitante').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const categoria = document.getElementById('categoria').value;
  const impacto = document.getElementById('impacto').value;
  const urgencia = document.getElementById('urgencia').value;
  const tiempoEstimado = document.getElementById('tiempoEstimado').value;
  const descripcion = document.getElementById('descripcion').value.trim();

  try {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombreSolicitante, correo, categoria, impacto, urgencia, tiempoEstimado, descripcion })
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      mensaje.innerHTML = `<p style="color:green; font-weight:bold;">${data.mensaje} Redireccionando...</p>`;
      formTicket.reset();
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } else {
      mensaje.innerHTML = `<p style="color:red; font-weight:bold;">${data.mensaje}</p>`;
    }
  } catch (error) {
    mensaje.innerHTML = '<p style="color:red;">Error crítico de red al conectar con el servidor.</p>';
  }
});