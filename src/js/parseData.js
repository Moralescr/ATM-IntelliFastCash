/*
@Parms
  @statusNumber
  @Return statusDescription
*/
function getStatusText(statusNumber) {
  let statusDescription = '';
  switch (statusNumber) {
    case '0':
      statusDescription = 'Pendiente';
      break;
    case '1':
      statusDescription = 'En uso';
      break;
    case '2':
      statusDescription = 'Cancelada';
      break;
    case '3':
      statusDescription = 'Enviada';
      break;
    case '4':
      statusDescription = 'Expirada';
      break;
    case '5':
      statusDescription = 'Pendiente o en uso';
      break;
    case '6':
      statusDescription = 'Usada';
      break;
    default:
      statusDescription = 'Desconocida';
  }
  return statusDescription;
}

/*
@Parms
  @amount
  @currency
  @Return amountParse
*/
function parseAmount(amount, currency) {
  let amountParse;
  if (currency === '188') {
    amountParse = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(amount / 100);
  } else {
    amountParse = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount / 100);
  }
  return amountParse;
}

/*
@Parms
  @dateToFormat
  @Return formattedDate
*/
function parseDate(dateToFormat) {
  const [fechaStr] = dateToFormat.split(' ');        // "25/07/31"
  const [yy, mm, dd] = fechaStr.split('/');          // separates parts
  const year = `20${yy}`;                            // Convert "25" → "2025"
  const formattedDate = `${dd}/${mm}/${year}`;       // Create "31/07/2025"                    
  return formattedDate;
}

/*
@Parms
  @status
  @Return statusColor
*/

function getStatusColor(status) {
  let statusColor = '';
  switch (status) {
    case '0':
      statusColor = 'success';
      break;
    case '4':
      statusColor = 'danger';
      break;
    case '6':
      statusColor = 'primary';
      break;
    default:
      statusColor = 'grey';
  }
  return statusColor; 
}

export { getStatusText, parseAmount, parseDate, getStatusColor };