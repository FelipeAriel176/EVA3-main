const btnAgregar = document.getElementById('btnAgregar');
const btnCargar = document.getElementById('btnCargar');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const estadoSesion = document.getElementById('estadoSesion');
const tablaProductosBody = document.getElementById('tablaProductosBody');
const mensaje = document.getElementById('mensaje');

btnAgregar.addEventListener('click', () => { window.location.href = 'ingresar.html'; });
btnCargar.addEventListener('click', cargarProductos);
btnLogin.addEventListener('click', () => { window.location.href = 'login.html'; });
btnLogout.addEventListener('click', cerrarSesion);

document.addEventListener('DOMContentLoaded', async () => {
  await verificarSesion();
  await cargarProductos();
});

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-eliminar')) {
    await eliminarProducto(e.target.dataset.id);
  }

  if (e.target.classList.contains('btn-actualizar')) {
    window.location.href = `ingresar.html?id=${e.target.dataset.id}`;
  }
});

async function verificarSesion() {
  try {
    const response = await fetch('/api/auth/perfil', { credentials: 'include' });
    const data = await response.json();

    if (data.ok) {
      estadoSesion.textContent = `Sesión activa: ${data.usuario}`;
      btnLogin.style.display = 'none';
      btnLogout.style.display = 'inline-block';
    } else {
      mostrarSesionInactiva();
    }
  } catch (error) {
    mostrarSesionInactiva();
  }
}

function mostrarSesionInactiva() {
  estadoSesion.textContent = 'Sin sesión activa. Puede listar, pero no crear, actualizar o eliminar.';
  btnLogin.style.display = 'inline-block';
  btnLogout.style.display = 'none';
}

async function cargarProductos() {
  mensaje.innerHTML = '';

  try {
    const response = await fetch('/api/productos');
    const data = await response.json();

    if (!data.ok || data.data.length === 0) {
      tablaProductosBody.innerHTML = '<tr><td colspan="6">No hay productos registrados.</td></tr>';
      return;
    }

    tablaProductosBody.innerHTML = data.data.map(producto => `
      <tr>
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>$${Number(producto.precio).toFixed(2)}</td>
        <td>${producto.stock}</td>
        <td>
          <button class="btn-accion btn-actualizar" data-id="${producto.id}">Actualizar</button>
          <button class="btn-accion btn-eliminar btn-peligro" data-id="${producto.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tablaProductosBody.innerHTML = '<tr><td colspan="6">Error al cargar los productos.</td></tr>';
  }
}

async function eliminarProducto(id) {
  if (!confirm('¿Desea eliminar este producto?')) return;

  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.ok) {
      mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;
      await cargarProductos();
    } else {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;
      if (response.status === 401) {
        setTimeout(() => { window.location.href = 'login.html'; }, 1200);
      }
    }
  } catch (error) {
    mensaje.innerHTML = '<p class="error">Error al eliminar el producto.</p>';
  }
}

async function cerrarSesion() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();
    mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;
    await verificarSesion();
  } catch (error) {
    mensaje.innerHTML = '<p class="error">Error al cerrar sesión.</p>';
  }
}
