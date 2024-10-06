import axios from 'axios';

export async function ChangeStatus(usuario_id, currentStatus) {
  try {
    if (currentStatus === 0) {
      await axios.put(`http://localhost:5000/api/usuario/activate/${usuario_id}`);
    } else {
      await axios.put(`http://localhost:5000/api/usuario/deactivate/${usuario_id}`);
    }
  } catch (error) {
    console.error(error);
    alert('Hubo un error');
  }
}
