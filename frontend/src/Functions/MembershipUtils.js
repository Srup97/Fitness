// membershipUtils.js (puedes crear este nuevo archivo)
export const compareMemberships = (membershipA, membershipB, sortCriteria) => {
    switch (sortCriteria) {
      case 'estatus':
        return membershipA.status.localeCompare(membershipB.status);
      case 'tipo':
        return membershipA.datosMembresia.nombre.localeCompare(membershipB.datosMembresia.nombre);
      case 'precioAsc':
        return membershipA.datosMembresia.costo - membershipB.datosMembresia.costo;
      case 'precioDesc':
        return membershipB.datosMembresia.costo - membershipA.datosMembresia.costo;
      case 'fechaInicioAsc':
        return new Date(membershipA.start_date) - new Date(membershipB.start_date);
      case 'fechaInicioDesc':
        return new Date(membershipB.start_date) - new Date(membershipA.start_date);
      case 'fechaFinAsc':
        return new Date(membershipA.end_date) - new Date(membershipB.end_date);
      case 'fechaFinDesc':
        return new Date(membershipB.end_date) - new Date(membershipA.end_date);
      default:
        return 0; // Sin ordenamiento
    }
  };
  