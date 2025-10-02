document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('lang');

  const dict = {
    nl: {
      title: 'Vista Magazijn Uitleen',
      'menu.dashboard': 'Menu',
      'menu.inventory': 'Voorraad',
      'menu.orders': 'Bestellingen',
      'menu.qr': 'QR-scan',
      'menu.return': 'Inleveren',

      // Voorraad
      'inventory.title': 'Voorraadbeheer',
      'inventory.addNew': 'Nieuw artikel toevoegen',
      'inventory.addBtn': '➕ Toevoegen',
      'col.item': 'Artikelnaam',
      'col.qty': 'Aantal',
      'col.loc': 'Locatie',
      'col.date': 'Keuringsdatum',
      'col.actions': 'Acties',

      // Bestellingen
      'orders.title': 'Bestellingen',
      'col.studentId': 'Leerlingnr',
      'col.name': 'Naam',
      'col.status': 'Status',
      'col.date': 'Datum',

      // Inleveren
      'return.title': 'Inleveren',
      'col.returnDate': 'Inleverdatum'
    },
    en: {
      title: 'Vista Inventory',
      'menu.dashboard': 'Menu',
      'menu.inventory': 'Inventory',
      'menu.orders': 'Orders',
      'menu.qr': 'QR Scan',
      'menu.return': 'Return',

      // Voorraad
      'inventory.title': 'Inventory Management',
      'inventory.addNew': 'Add New Item',
      'inventory.addBtn': '➕ Add',
      'col.item': 'Item',
      'col.qty': 'Qty',
      'col.loc': 'Location',
      'col.date': 'Inspection Date',
      'col.actions': 'Actions',

      // Bestellingen
      'orders.title': 'Orders',
      'col.studentId': 'Student ID',
      'col.name': 'Name',
      'col.status': 'Status',
      'col.date': 'Date',

      // Inleveren
      'return.title': 'Return Items',
      'col.returnDate': 'Return Date'
    }
  };

  const applyLang = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[lang][key]) el.textContent = dict[lang][key];
    });

    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.getAttribute('data-i18n')) {
      const key = titleEl.getAttribute('data-i18n');
      if (dict[lang][key]) titleEl.textContent = dict[lang][key];
    }
  };

  if (langSelect) {
    langSelect.addEventListener('change', e => applyLang(e.target.value));
    applyLang(langSelect.value);
  } else {
    applyLang('nl');
  }

  /*** VOORRAAD ***/
  const inventoryTable = document.getElementById('inventory');
  const addItemBtn = document.getElementById('addItemBtn');
  let inventoryItems = JSON.parse(localStorage.getItem('inventory')) || [];

  const renderInventory = () => {
    if (!inventoryTable) return;
    inventoryTable.innerHTML = '';
    inventoryItems.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.loc}</td>
        <td>${item.date || '-'}</td>
        <td>
          <button class="btn ghost edit" data-index="${index}">✏️</button>
          <button class="btn ghost delete" data-index="${index}">🗑️</button>
        </td>
      `;
      inventoryTable.appendChild(row);
    });

    document.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        inventoryItems.splice(idx, 1);
        localStorage.setItem('inventory', JSON.stringify(inventoryItems));
        renderInventory();
      });
    });

    document.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        const item = inventoryItems[idx];
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemQty').value = item.qty;
        document.getElementById('itemLoc').value = item.loc;
        document.getElementById('itemDate').value = item.date;
        inventoryItems.splice(idx, 1);
        localStorage.setItem('inventory', JSON.stringify(inventoryItems));
        renderInventory();
      });
    });
  };
  renderInventory();

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const name = document.getElementById('itemName').value.trim();
      const qty = document.getElementById('itemQty').value.trim();
      const loc = document.getElementById('itemLoc').value.trim();
      const date = document.getElementById('itemDate').value;

      if (!name || !qty || !loc) return alert('Please fill all fields!');

      inventoryItems.push({ name, qty, loc, date });
      localStorage.setItem('inventory', JSON.stringify(inventoryItems));

      document.getElementById('itemName').value = '';
      document.getElementById('itemQty').value = '';
      document.getElementById('itemLoc').value = '';
      document.getElementById('itemDate').value = '';

      renderInventory();
    });
  }

  /*** BESTELLINGEN ***/
  const ordersTable = document.getElementById('orders');
  let orders = JSON.parse(localStorage.getItem('orders')) || [
    { student: '12345', name: 'J. Peters', item: 'Hamer', status: 'Gereserveerd', date: '10-12-2025' },
    { student: '67890', name: 'L. Zhang', item: 'Boormachine', status: 'Ingeleverd', date: '12-12-2025' }
  ];

  const renderOrders = () => {
    if (!ordersTable) return;
    const tbody = ordersTable.querySelector('tbody');
    tbody.innerHTML = '';
    orders.forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${o.student}</td>
        <td>${o.name}</td>
        <td>${o.item}</td>
        <td><span class="pill">${o.status}</span></td>
        <td>${o.date}</td>
      `;
      tbody.appendChild(tr);
    });
  };
  renderOrders();

  /*** INLEVEREN ***/
  const returnTable = document.getElementById('returns');
  let returns = JSON.parse(localStorage.getItem('returns')) || [
    { item: 'Hamer', student: '12345', name: 'J. Peters', returnDate: '01-10-2025' },
    { item: 'Boormachine', student: '67890', name: 'L. Zhang', returnDate: '01-10-2025' }
  ];

  const renderReturns = () => {
    if (!returnTable) return;
    const tbody = returnTable.querySelector('tbody');
    tbody.innerHTML = '';
    returns.forEach((r, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.item}</td>
        <td>${r.student}</td>
        <td>${r.name}</td>
        <td>${r.returnDate}</td>
        <td><button class="btn ghost return-btn" data-index="${idx}">✔️ Returned</button></td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll('.return-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        returns.splice(idx, 1);
        localStorage.setItem('returns', JSON.stringify(returns));
        renderReturns();
      });
    });
  };
  renderReturns();
});
