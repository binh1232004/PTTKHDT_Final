import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, runTransaction, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import Utils from "./utils.js";
class InvoiceImportManager {
  constructor() {
    this.utils = new Utils();
    this.getInp();
    this.getFirebaseStuff();
    this.getOptionSupplier();
    this.getButton();
    this.creatTableData();
    this.getForm();
    this.addBtn.addEventListener('click', this.addEventAddInvoice.bind(this));
  }
  getForm() {
    this.formOrder = document.getElementById('FormOrder');
  }
  getButton() {
    //order
    this.addBtn = document.getElementById('AddBtn');
    this.deleteBtn = document.getElementById('DeleteBtn');
    this.updateBtn = document.getElementById('UpdateBtn');
  }
  getFirebaseStuff() {
    const firebaseConfig = {
      apiKey: "AIzaSyDDOUEj5ZXHt_TvN10dbyj5Yg3xX1T5fus",
      authDomain: "demosoftwaretechnology.firebaseapp.com",
      databaseURL: "https://demosoftwaretechnology-default-rtdb.firebaseio.com",
      projectId: "demosoftwaretechnology",
      storageBucket: "demosoftwaretechnology.appspot.com",
      messagingSenderId: "375046175781",
      appId: "1:375046175781:web:0d1bfac1b8ca71234293cc",
      measurementId: "G-120GXQ1F6L"
    };

    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase();

  }
  getOptionSupplier() {
    const supplierRef = ref(this.db, 'Supplier');
    get(supplierRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const key in data) {
          let option = document.createElement('option');
          option.innerHTML = data[key].Name;
          option.value = key;
          this.supplierInp.appendChild(option);
        }
      }
    })
  }

  getInp() {
    //order
    this.IDInp = document.getElementById('IDInp');
    this.dateInp = document.getElementById('DateInp');
    this.supplierInp = document.getElementById('SupplierInp');
    this.noteInp = document.getElementById('NoteInp');
    this.paymentMethodInp = document.getElementById('PaymentMethodInp');
  }
  getInformationSupplier(supplierID) {
    this.address = document.getElementById('Address');
    this.supplier = document.getElementById('Supplier');
    this.phone = document.getElementById('Phone');

    const supplierRef = ref(this.db, 'Supplier/' + supplierID);
    get(supplierRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.address.innerHTML = data.Address;
        this.phone.innerHTML = data.Phone;
        this.supplier.innerHTML = data.Name;
      }
    })
  }
  async addEventAddInvoice() {
    const runTransactionResult = await runTransaction(ref(this.db, 'InvoiceImportCounter'), (counter) => {
      return counter + 1;
    })
    const InvoiceImportID = 'HDNH' + this.utils.formatCounter(runTransactionResult.snapshot.val(), 5);

    const InvoiceImportRef = ref(this.db, 'InvoiceImport/' + InvoiceImportID);
    set(InvoiceImportRef, {
      ID: InvoiceImportID,
      Date: this.utils.formatDateToDDMMYYYY(this.dateInp.value),
      Supplier: this.supplierInp.value,
      Note: this.noteInp.value,
      PaymentMethod: this.paymentMethodInp.value
    }).then(() => {
      alert('Add Invoice Import Success');
      window.location.reload();
    }).catch((error) => {
      alert('Add Invoice Import Fail');
      console.error(error);
    })
  }
  async addEventDeleteInvoice() {
    const InvoiceImportRef = ref(this.db, 'InvoiceImport/' + this.IDInp.value);
    remove(InvoiceImportRef).then(() => {
      alert('Delete Invoice Import Success');
      window.location.reload();
    }).catch((error) => {
      alert('Delete Invoice Import Fail');
      console.error(error);
    })
  }
  creatTableData() {
    let dbref = ref(this.db);
    let dataSet = [];
    get(child(dbref, 'InvoiceImport')).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let value = childSnapshot.val();
        dataSet.push([
          value.ID,
          value.Date,
          value.Supplier,
          value.Note,
          value.PaymentMethod
        ])
      })
      console.log(dataSet);
      var table = $('#table-order').DataTable({
        data: dataSet,
        columns: [
          { title: 'ID' },
          { title: 'Ngày mua' },
          { title: 'Nhà cung cấp' },
          { title: 'Ghi chú' },
          { title: 'PTTT' }
        ],
        rowCallback: (row, data) => {
          $(row).on('click', () => {
            this.createTableOrderDetail(data[0], data); 
          })
        }
      })
    })

  }
  createTableOrderDetail(orderID, data) {
    this.IDInp.value = data[0];
    this.dateInp.value = data[1];
    this.supplierInp.value = data[2];
    this.noteInp.value = data[3];
    this.paymentMethodInp.value = data[4];
    this.getInformationSupplier(data[2]);

    this.orderDetailIDInvoiceInp.value = data[0];
  }
}

const invoiceImportManager = new InvoiceImportManager();