import Utils from "./utils.js";
import InvoiceImport from "../DAO/invoiceImport.js";
import Supplier from "../DAO/supplier.js";
import Product from "../DAO/product.js";
import Order from "../DAO/order.js";
import InvoiceExport from "../DAO/invoiceExport.js";
class IssueManager {
    constructor() {
        this.utils = new Utils();
        this.invoiceImportDB = new InvoiceImport();
        this.supplierDB = new Supplier();
        this.productDB = new Product();
        this.orderDB = new Order();
        this.invoiceExportDB = new InvoiceExport();
        this.getInp();
        this.createTable();
        this.issueBtn = document.getElementById('issue-btn');

    }
    getInp() {
        this.OrderDetail = document.getElementById('order-detail');
        this.ODID = document.getElementById('ODID');
        this.Customer = document.getElementById('Customer');
        this.Address = document.getElementById('Address');
        this.Phone = document.getElementById('Phone');
        this.getTotal = document.getElementById('total-full');


        this.ZIPInp = document.getElementById('ZIPInp');
        this.NoteInp = document.getElementById('NoteInp');
    }
    async createTable() {
        const orderList = await this.orderDB.getOrderList();
        let objData = [];
        let dataSet = [];
        orderList.forEach(order => {
            objData.push(order.item)
        })
        orderList.forEach(order => {
            dataSet.push([
                order.key,
                order.item.name,
                this.utils.formatDateToDDMMYYYY(order.item.orderDate),
                this.utils.formatToVND(order.item.totalAmount),
                order.item.isIssue ? 'Đã xuất' : 'Chưa xuất'
            ]);
        });
        $('#table-order').DataTable({
            data: dataSet,
            columns: [
                { title: "ID" },
                { title: "Khách hàng" },
                { title: "Ngày xuất hóa đơn" },
                { title: "Thành tiền" },
                { title: "Xuất kho" }
            ],
            rowCallback: (row, data) => {
                if(data[4] == 'Đã xuất'){
                    $(row).addClass('bg-success text-white');
                }
                $(row).on('click', () => {
                    this.handleRowClick(row, data, objData);
                });
            }
        });
    }
    handleRowClick(row, data, objData) {
        this.issueBtn.addEventListener('click', () => {
            if (this.ZIPInp.value !== '') {
                this.invoiceExportDB.addInvoiceExport({
                    ...objData[row._DT_RowIndex],
                    dateIssue: this.utils.getCurrentDayBinh(),
                    noteIssue: this.NoteInp.value,
                    ZIPIssue: this.ZIPInp.value
                })
                this.orderDB.updateOrder(data[0], {
                    isIssue: true
                })
            }
            else{
                alert('Nhập Mã bưu điện')
            }
        })
        this.issueBtn.hidden = false;
        let indexRow = row._DT_RowIndex;
        $('#order-detail tbody').remove();
        this.ODID.innerText = data[0];
        let totalFull = 0;
        this.Customer.innerText = objData[indexRow].name;
        this.Address.innerText = objData[indexRow].address;
        this.Phone.innerText = objData[indexRow].phone;
        const details = objData[indexRow].items;
        for (let product in details) {
            let id = document.createElement('th');
            let namePro = document.createElement('td');
            let quantity = document.createElement('td');
            let price = document.createElement('td');
            let total = document.createElement('td');
            id.innerHTML = product;
            quantity.innerHTML = details[product]['quantity'];
            namePro.innerHTML = details[product]['item_name'];
            price.innerHTML = this.utils.formatToVND(details[product]['unit_price']);
            total.innerHTML = this.utils.formatToVND(details[product]['total_price']);
            totalFull += details[product]['total_price'];
            this.getTotal.innerHTML = this.utils.formatToVND(totalFull);

            let tr = document.createElement('tr');
            tr.append(id, namePro, quantity, price, total);
            let tbody = document.createElement('tbody');
            tbody.appendChild(tr);
            this.OrderDetail.append(tbody);
        }
    }
}

const invoiceImportManager = new IssueManager();