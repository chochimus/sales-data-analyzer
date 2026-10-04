import data from './data.json' with { type: 'json'};

// filtering
const filterOrdersBy = (orders, cb, ...args) => {
  return orders.filter(order => cb(order, ...args));
}

const statusFilter = (order, status) => {
  return order.status === status
}

const overTotalFilter = (order, total) => {
  return order.total > total;
}

const inDateRange = (order, range) => {
  let start = convertDateString(range[0]);
  let end = convertDateString(range[1]);
  let current = convertDateString(order.createdAt);

  return start <= current && current < end;  
}

const convertDateString = (dateString) => {
  let parts = dateString.split('-');
  return new Date(parts[0], parts[1], parts[2]);
}



console.log('Completed Orders');
console.log(filterOrdersBy(data, statusFilter, 'completed'));
console.log('Orders over $100');
console.log(filterOrdersBy(data, overTotalFilter, 100));
console.log('Orders in August');
console.log(filterOrdersBy(data, inDateRange, ['2026-08-01', '2026-09-01']));
