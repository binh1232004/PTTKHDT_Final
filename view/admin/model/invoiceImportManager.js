import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, runTransaction, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import Utils from "./utils.js";
class InvoiceImportManager {
  constructor() {
    this.utils = new Utils();
    this.getInp();
    this.getFirebaseStuff();
    this.getOptionSupplier();
    this.getOptionProduct();
    this.addOptionSize();
    this.getButton();
    this.creatTableData();
    this.getForm();
    this.addBtn.addEventListener('click', this.addEventAddInvoice.bind(this));
    this.orderDetailAddBtn.addEventListener('click', this.addEventAddProduct.bind(this));
    // this.applyConditionInputName();
  }
  getForm() {
    this.formOrder = document.getElementById('FormOrder');
    this.formOrderDetail = document.getElementById('FormOrderDetail');
    console.log(this.formOrderDetail);
  }
  getButton() {
    //order
    this.addBtn = document.getElementById('AddBtn');
    this.deleteBtn = document.getElementById('DeleteBtn');
    this.updateBtn = document.getElementById('UpdateBtn');
    //order detail
    this.orderDetailAddBtn = document.getElementById('OrderDetailAddBtn');
    this.orderDetailDeleteBtn = document.getElementById('OrderDetailDeleteBtn');
    this.orderDetailUpdateBtn = document.getElementById('OrderDetailUpdateBtn');
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
  getOptionProduct() {
    const productRef = ref(this.db, 'Product');
    get(productRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const key in data) {
          let option = document.createElement('option');
          option.innerHTML = data[key].Name;
          option.value = key;
          this.orderDetailAvailableNameInp.appendChild(option);
        }
      }
    })
  }
  addOptionSize() {
    const SIZE = ['S', 'M', 'L', 'XL', 'XXL'];
    SIZE.forEach((size) => {
      let option = document.createElement('option');
      option.innerHTML = size;
      option.value = size;
      this.orderDetailSizeInp.appendChild(option);
    })
  }

  getInp() {
    //order
    this.IDInp = document.getElementById('IDInp');
    this.dateInp = document.getElementById('DateInp');
    this.supplierInp = document.getElementById('SupplierInp');
    this.noteInp = document.getElementById('NoteInp');
    this.paymentMethodInp = document.getElementById('PaymentMethodInp');
    //order detail
    this.orderDetailSizeInp = document.getElementById('OrderDetailSizeInp');
    this.orderDetailIDInvoiceInp = document.getElementById('OrderDetailIDInvoiceInp');
    this.orderDetailIDProductInp = document.getElementById('OrderDetailIDProductInp');
    this.orderDetailNewNameInp = document.getElementById('OrderDetailNewNameInp');
    this.orderDetailAvailableNameInp = document.getElementById('OrderDetailAvailableNameInp');
    this.orderDetailQuantityInp = document.getElementById('OrderDetailQuantityInp');
    this.orderDetailUnitPriceInp = document.getElementById('OrderDetailUnitPriceInp');
    this.orderDetailAmountInp = document.getElementById('OrderDetailAmountInp');
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
      Date: this.dateInp.value,
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
  addLoopShowHide() {
    setInterval(() => {
      if (this.orderDetailAvailableNameInp.value !== '') {
        this.orderDetailNewNameInp.disabled = true;
      }
      if (this.orderDetailNewNameInp.value !== '') {
        this.orderDetailAvailableNameInp.disabled = true;
      }

      if (this.IDInp.value !== '') {
        this.formOrderDetail.hidden = false;
        this.formOrder.hidden = true;
      }
    }, 1000);
  }
  applyConditionInputName() {
    this.orderDetailNewNameInp.addEventListener('focus', () => {
      this.orderDetailAvailableNameInp.disabled = true
    });
    this.orderDetailNewNameInp.addEventListener('blur', () => {
      this.orderDetailAvailableNameInp.disabled = false;
    });
    this.orderDetailAvailableNameInp.addEventListener('focus', () => {
      this.orderDetailNewNameInp.disabled = true;
    });
    this.orderDetailAvailableNameInp.addEventListener('blur', () => {
      this.orderDetailNewNameInp.disabled = false;
    })
  }

  async addEventAddProduct() {
    const dbref = ref(this.db);
    if (this.orderDetailAvailableNameInp.value === '') {
      const runTransactionResult = await runTransaction(ref(this.db, 'ProductCounter'), (counter) => {
        return counter + 1;
      })
      const ProductID = 'SP' + this.utils.formatCounter(runTransactionResult.snapshot.val(), 5);
      const Size = {
        L: 0,
        M: 0,
        S: 0,
        XL: 0,
        XXL: 0
      }
      Size[this.orderDetailSizeInp.value] = Number(this.orderDetailQuantityInp.value);
      const data = {
        Name: this.orderDetailNewNameInp.value,
        Price: '',
        PurchasePrice: Number(this.orderDetailUnitPriceInp.value),
        Promotion: '',
        Size: Size,
        Category: '',
        Images: '',
        CreateDate: this.utils.getCurrentDay(),
        UpdateDate: this.utils.getCurrentDay(),
        Detail: '',
        Description: ''
      }
      set(child(dbref, 'Product/' + ProductID), data).then(() => {
        alert('Add Product Success');
        window.location.reload();
      }).catch((error) => {
        alert('Add Product Fail');
        console.error(error);
      })

    }
    else {
      const productRef = ref(this.db, 'Product/' + this.orderDetailAvailableNameInp.value);
      get(productRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const Size = data.Size;
          Size[this.orderDetailSizeInp.value] += Number(this.orderDetailQuantityInp.value);
          update(productRef, {
            Size: Size
          }).then(() => {
            alert('Update Product Success');
            window.location.reload();
          }).catch((error) => {
            alert('Update Product Fail');
            console.error(error);
          })
        }
      })
    }
  }
}

const invoiceImportManager = new InvoiceImportManager();