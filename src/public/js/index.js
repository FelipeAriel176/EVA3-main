const btnAgregar = document.getElementById('btnAgregar');
const btnCargar = document.getElementById('btnCargar');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const estadoSesion = document.getElementById('estadoSesion');
const tablaTicketsBody = document.getElementById('tablaTicketsBody');
const mensaje = document.getElementById('mensaje');

btnAgregar.addEventListener('click', () => { window.location.href = 'CrearTicket.html'; });
btnCargar.addEventListener('click', cargarTickets);
btnLogin.addEventListener('click', () => { window.location.href = 'login.html'; });
btnLogout.addEventListener('click', cerrarSesion);

document.addEventListener('DOMContentLoaded', async () => {
  await verificarSesion();
  await cargarTickets();
});

async function verificarSesion() {
  try {
    const response = await fetch('/api/auth/perfil', { credentials: 'include' });
    const data = await response.json();

    if (data.ok) {
      estadoSesion.textContent = `Sesión activa: ${data.usuario}`;
      btnLogin.style.display = 'none';
      btnLogout.style.display = 'inline-block';
      return true;
    } else {
      mostrarSesionInactiva();
      return false;
    }
  } catch (error) {
    mostrarSesionInactiva();
    return false;
  }
}

function mostrarSesionInactiva() {
  estadoSesion.textContent = 'Sin sesión activa. Modo Lectura habilitado.';
  btnLogin.style.display = 'inline-block';
  btnLogout.style.display = 'none';
}

async function cargarTickets() {
  mensaje.innerHTML = '';
  try {
    const response = await fetch('/api/tickets');
    const resJson = await response.json();

    if (!resJson.data || resJson.data.length === 0) {
      tablaTicketsBody.innerHTML = '<tr><td colspan="7" style="padding:15px; text-align:center;">No hay tickets de soporte registrados actualmente.</td></tr>';
      return;
    }

    tablaTicketsBody.innerHTML = resJson.data.map(ticket => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding:10px;">${ticket.id.slice(-6)}</td>
        <td style="padding:10px;"><strong>${ticket.nombreSolicitante}</strong><br><small style="color:#666;">${ticket.correo}</small></td>
        <td style="padding:10px;"><span style="background:#e0e0e0; padding:2px 6px; border-radius:3px; font-size:12px;">${ticket.categoria}</span></td>
        <td style="padding:10px;">U: ${ticket.urgencia} / I: ${ticket.impacto}</td>
        <td style="padding:10px;">
          <select onchange="cambiarEstado('${ticket.id}', this.value)" style="padding:4px;">
            <option value="pendiente" ${ticket.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="en proceso" ${ticket.estado === 'en proceso' ? 'selected' : ''}>En Proceso</option>
            <option value="resuelto" ${ticket.estado === 'resuelto' ? 'selected' : ''}>Resuelto</option>
          </select>
        </td>
        <td style="padding:10px;"><strong>${ticket.prioridad}</strong></td>
        <td style="padding:10px;">
          <button class="btn-peligro" style="padding: 4px 8px; font-size:12px; background:#d9534f; color:white; border:none; border-radius:3px; cursor:pointer;" onclick="eliminarTicket('${ticket.id}')">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tablaTicketsBody.innerHTML = '<tr><td colspan="7" style="padding:15px; text-align:center; color:red;">Error de conexión al cargar los tickets.</td></tr>';
  }
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ estado: nuevoEstado })
    });
    const data = await response.json();
    if (data.ok) {
      mensaje.innerHTML = `<p style="color:green; font-weight:bold;">${data.mensaje}</p>`;
      cargarTickets();
    } else {
      mensaje.innerHTML = `<p style="color:red; font-weight:bold;">${data.mensaje}</p>`;
      if(response.status === 401) setTimeout(() => window.location.href = 'login.html', 1500);
    }
  } catch (error) {
    mensaje.innerHTML = '<p style="color:red;">Error al procesar el cambio de estado.</p>';
  }
}

async function eliminarTicket(id) {
  if (!confirm('¿Seguro que desea eliminar esta solicitud de soporte?')) return;
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    if (data.ok) {
      mensaje.innerHTML = `<p style="color:green; font-weight:bold;">${data.mensaje}</p>`;
      cargarTickets();
    } else {
      mensaje.innerHTML = `<p style="color:red; font-weight:bold;">${data.mensaje}</p>`;
      if(response.status === 401) setTimeout(() => window.location.href = 'login.html', 1500);
    }
  } catch (error) {
    mensaje.innerHTML = '<p style="color:red;">Error al conectar con el endpoint de eliminación.</p>';
  }
}

async function cerrarSesion() {
  try {
    const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.reload();
  } catch (error) {
    mensaje.innerHTML = '<p style="color:red;">Error al procesar el cierre de sesión.</p>';
  }
}