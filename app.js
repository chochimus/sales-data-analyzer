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
  const start = convertDateString(range[0]);
  const end = convertDateString(range[1]);
  const current = convertDateString(order.createdAt);

  return start <= current && current < end;  
}


// helper
const convertDateString = (dateString) => {
  const parts = dateString.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// console.log('Completed Orders');
// console.log(filterOrdersBy(data, statusFilter, 'completed'));
// console.log('Orders over $100');
// console.log(filterOrdersBy(data, overTotalFilter, 100));
// console.log('Orders in August');
// console.log(filterOrdersBy(data, inDateRange, ['2026-08-01', '2026-09-01']));

// sorting

const sortOrdersBy = (orders, cb, ...args) => {
  let ordersCopy = [...orders];
  return ordersCopy.sort((orderA, orderB) => cb(orderA, orderB, ...args));
}

const sizeSort = (orderA, orderB, order='desc') => {
  if (order === 'asc') {
    return orderA.items.length - orderB.items.length;
  } else {
    return orderB.items.length - orderA.items.length;
  }
}

const dateSort = (orderA, orderB, order='desc') => {
  if (order === 'asc') {
    return convertDateString(orderA.createdAt) - convertDateString(orderB.createdAt);
  } else {
    return convertDateString(orderB.createdAt) - convertDateString(orderA.createdAt);
  }
}

const nameSort = (orderA, orderB, order='asc') => {
  if (order === 'asc') {
    if (orderA.customer < orderB.customer) return -1;
    if (orderA.customer > orderB.customer) return 1;
    return 0;
  } else {
    if (orderA.customer > orderB.customer) return -1;
    if (orderA.customer < orderB.customer) return 1;
    return 0;
  }
}

// console.log(sortOrdersBy(data, sizeSort));
// console.log(sortOrdersBy(data, dateSort));
// console.log(sortOrdersBy(data, nameSort));

// grouping

const groupOrdersBy = (orders, property) => {
  return Object.groupBy(orders, (order) => order[property]);
}

const groupSalesBy = (orders, property) => {
  const sales = orders.flatMap(order => order.items);
  return Object.groupBy(sales, sale => sale[property]);
}

// console.log(groupOrdersBy(data, 'country'));
// console.log(groupOrdersBy(data, 'status'));
// console.log(groupSalesBy(data, 'category'));
// console.log(groupOrdersBy(data, 'customer'));

// mapping 

const cleanOrders = (orders) => {
  return orders.map(order => {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      totalItems,
      createdAt: order.createdAt,
    }
  });
}

// console.log(cleanOrders(data));


// aggregation

const totalRevenue = (orders) => {
  return orders.reduce((total, order) => total + order.total, 0);
}

console.log(totalRevenue(data));

const avgOrderValue = (orders) => {
  return totalRevenue(orders) / orders.length;
}

console.log(avgOrderValue(data));

const numberOfOrders = (orders) => {
  return orders.length;
}

console.log(numberOfOrders(data));

const unitsSold = (orders) => {
  const items = orders.flatMap(order => order.items);
  return items.reduce((total, item) => total + item.quantity, 0);
}

console.log(unitsSold(data));

const revenuePerCategory = (orders) => {
  return orders.flatMap(order => order.items)
    .reduce((aggregate, item) => {
      aggregate[item.category] = (aggregate[item.category] || 0) + item.price * item.quantity;
      return aggregate;
    }, {});
}

console.log(revenuePerCategory(data));

