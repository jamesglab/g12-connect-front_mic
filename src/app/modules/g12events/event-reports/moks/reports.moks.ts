export const createObjectReportByEvent = (report, i) => {
  return {
    No: i + 1,
    Nombre: report.user?.name
      ? report.user.name.toString().toUpperCase()
      : 'N/A',
    Apellido: report.user?.last_name
      ? report.user.last_name.toString().toUpperCase()
      : 'N/A',
    'No. Documento': report.user?.identification
      ? report.user.identification
      : 'N/A',
    'Fecha Nacimiento': report.user?.birth_date
      ? new Date(report.user.birth_date)
      : 'N/A',
    Genero: report.user?.gender
      ? report.user.gender.toString().toUpperCase()
      : 'N/A',
    Telefono: report.user?.phone ? report.user.phone : 'N/A',
    'E-mail': report.user?.email ? report.user.email : 'N/A',
    Idioma: validateLanguage(report.user),
    Pais: report.user?.country
      ? report.user.country.toString().toUpperCase()
      : 'N/A',
    'Tipo de Iglesia': report.user?.type_church
      ? report.user?.type_church
      : 'N/A',
    Sede: report.church?.name
      ? report.church.name.toString().toUpperCase()
      : 'N/A',
    Pastor: report.pastor?.name
      ? `${report.pastor.name} ${
          report.pastor.last_name ? report.pastor.last_name : ''
        }`
          .toString()
          .toUpperCase()
      : 'N/A',
    'Lider Doce': report.leader?.name
      ? `${report.leader.name} ${
          report.leader.last_name ? report.leader.last_name : ''
        }`
          .toString()
          .toUpperCase()
      : 'N/A',
    // 'Pastor de Sede': report.pastor_church ? `${report.pastor_church.name} ${report.pastor_church.last_name ? report.pastor_church.last_name : ''}` : 'N/A',
    'Fecha de Donación': new Date(report.transaction.created_at),
    'Referencia Transaccion': report.transaction.payment_ref
      ? report.transaction.payment_ref
      : 'N/A',
    Codigo: report.transaction.code ? report.transaction.code : 'N/A',
    'Metodo de pago': report.transaction.payment_method
      ? report.transaction.payment_method
      : 'N/A',
    'Nombre evento': report.donation?.name
      ? report.donation?.name.toString().toUpperCase()
      : 'N/A',
    'Nombre corte': report.cut?.name
      ? report.cut?.name.toString().toUpperCase()
      : 'N/A',
    Estado: report.transaction.status
      ? validateStatus(report.transaction.status).toString().toUpperCase()
      : 'N/A',
    Traductor: report.is_translator ? 'Si' : 'No',
    'Valor Traductor': report.is_translator ? report.price_translator : 'N/A',
    'Costo del Evento':
      report.cut.prices[report.transaction.currency?.toString().toLowerCase()],
    Moneda: report.transaction.currency
      ? report.transaction.currency.toString().toUpperCase()
      : 'N/A',
  };
};

export const validateLanguage = (user) => {
  if (user?.language) {
    switch (user?.language?.toString().toUpperCase()) {
      case 'ES': {
        return 'Español';
      }
      case 'EN': {
        return 'Ingles';
      }
      case 'PT': {
        return 'Portugues';
      }

      case 'FR': {
        return 'Frances';
      }
      case 'RS': {
        return 'Ruso';
      }
      default: {
        return 'N/A';
      }
    }
  } else {
    const ingles = [
      'ALEMANIA',
      'CANADÁ',
      'SUDÁFRICA',
      'SINGAPUR',
      'SAMOA',
      'REINO UNIDO',
      'IRLANDA',
      'ESTADOS UNIDOS DE AMÉRICA',
      'ESTADOS UNIDOS',
    ];
    const portugues = ['BRASIL'];
    const frances = ['CONGO(BRAZZAVILLE)', 'FRANCIA'];
    const ruso = ['EMIRATOS ÁRABES UNIDOS', 'SUECIA', 'RUSIA', 'PAÍSES BAJOS'];

    if (ingles.includes(user?.country?.toString().toUpperCase())) {
      return 'Ingles';
    } else if (portugues.includes(user?.country?.toString().toUpperCase())) {
      return 'Portugues';
    } else if (frances.includes(user?.country?.toString().toUpperCase())) {
      return 'Frances';
    } else if (ruso.includes(user?.country?.toString().toUpperCase())) {
      return 'Ruso';
    } else {
      return 'Español';
    }
  }
};

export const validateStatus = (status) => {
  if (parseInt(status) == 1) {
    return 'Aprobado';
  } else if (parseInt(status) == 2) {
    return 'En proceso';
  } else if (parseInt(status) == 3) {
    return 'Cancelado/Declinado';
  }
};

export const validatePaymentMethod = (payment_method) => {
  if (payment_method.toLowerCase() == 'credit') {
    return 'Tarjeta de credito';
  } else if (payment_method.toLowerCase() == 'pse') {
    return 'PSE';
  } else if (payment_method.toLowerCase() == 'cash') {
    return 'Efectivo';
  } else if (payment_method.toLowerCase() == 'administration') {
    return 'Administración';
  } else if (payment_method.toLowerCase() == 'code') {
    return 'Codigo';
  } else if (payment_method.toLowerCase() == 'cajas mci') {
    return 'Caja MCI';
  }
};
