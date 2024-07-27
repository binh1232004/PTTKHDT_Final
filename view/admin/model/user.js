import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

class UserManager {
    constructor() {
        this.ROLE = {
            USER: 1,
            ADMIN: 2,
            WAREHOUSE: 3    
        }
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
        this.auth = getAuth(this.app);

        this.ID = document.getElementById('IDInp');
        this.Email = document.getElementById('EmailInp');
        this.User = document.getElementById('UserInp');
        this.Address = document.getElementById('AddressInp');
        this.Phone = document.getElementById('PhoneInp');
        this.Role = document.getElementById('RoleInp');
        this.Birth = document.getElementById('current-time');

        this.AddBtn = document.getElementById('AddBtn');
        this.UpdBtn = document.getElementById('UpdateBtn');
        this.DelBtn = document.getElementById('DeleteBtn');
        this.listUser = document.getElementById('userList');
        this.stdno = 1;

        this.AddBtn.addEventListener('click', this.registerUser.bind(this));
        this.UpdBtn.addEventListener('click', this.updateUser.bind(this));  
        this.DelBtn.addEventListener('click', this.deleteUser.bind(this));
        window.addEventListener('load', this.getUser.bind(this));
        window.addEventListener('load', this.getClick.bind(this));
    }
    formatDateToDDMMYYYY(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
    deleteUser() {
        let uid = this.ID.value;
        const dbref = ref(this.db);
        remove(child(dbref, 'User/' + uid)).then(() => {
            alert("Người dùng đã được xóa thành công");
            location.reload();
        }).catch((error) => {
            alert("Xóa không thành công");
            console.log(error);
        });
    }
    updateUser(){
        let uid = this.ID.value;
        const today = new Date();
        const formattedDate = this.formatDateToDDMMYYYY(today);
        const dbref = ref(this.db);
        update(child(dbref, 'User/' + uid), {
            FullName: this.User.value,
            Email: this.Email.value,
            Address: this.Address.value,
            Birth: this.Birth.value,
            Phone: this.Phone.value,
            Role: this.ROLE[this.Role.value.toUpperCase()],
            UpdateDate: formattedDate
        }).then(() => {
            alert("Cập nhật người dùng thành công");
            location.reload();
        }).catch((error) => {
            alert("Câp nhật không thành công");
            console.log(error);
        });
    }
    getUser() {
        const dbref = ref(this.db);

        get(child(dbref, 'User')).then((user) => {
            user.forEach(std => {
                this.addUserAsList(std);
            });
        });
    }

    addUserAsList(std) {
        let key = std.key;
        let value = std.val();

        let id = document.createElement('th');
        let name = document.createElement('td');
        let email = document.createElement('td');
        let role = document.createElement('td');

        id.innerHTML = key;
        name.innerHTML = value.FullName;
        email.innerHTML = value.Email;
        if (value.Role == this.ROLE.ADMIN) {
            role.innerHTML = 'Quản trị viên';
            role.className = 'bg-success badge';
        } else if(value.Role == this.ROLE.USER){
            role.innerHTML = 'Người dùng';
            role.className = 'bg-warning badge';
        }
        role.style.marginTop = '5px';

        let tr = document.createElement('tr');
        tr.append(id, email, name, role);
        tr.className = 'clickTable';
        let tbody = document.createElement('tbody');
        tbody.appendChild(tr);
        this.listUser.append(tbody);
        this.stdno++;
    }

    retData(ID) {
        const dbref = ref(this.db);

        get(child(dbref, 'User/' + ID)).then((snapshot) => {
            if (snapshot.exists()) {
                let valRole;
                for(let role in this.ROLE){
                    if(this.ROLE[role] == snapshot.val().Role){
                        valRole = role.toLowerCase();
                    }
                }    
                this.Email.value = snapshot.val().Email;
                this.User.value = snapshot.val().FullName;
                this.Address.value = snapshot.val().Address;
                this.Birth.value = snapshot.val().Birth;
                this.Phone.value = snapshot.val().Phone;
                this.Role.value = valRole;
                this.ID.value = ID;
            } else {
                alert("Product does not exist");
            }
        }).catch((error) => {
            alert("Unsuccessful");
            console.log(error);
        });
    }

    getClick() {
        const dbref = ref(this.db);

        get(child(dbref, 'User')).then(() => {
            var rows = document.querySelectorAll("tr.clickTable");

            rows.forEach((row) => {
                row.addEventListener("click", () => {
                    var table = row.closest("tbody");
                    var headers = table.querySelectorAll("th");
                    headers.forEach((header) => {
                        this.retData(header.textContent);
                    });
                });
            });
        });
    }

    registerUser(evt) {
        evt.preventDefault();

        const today = new Date();
        const formattedDate = this.formatDateToDDMMYYYY(today);

        createUserWithEmailAndPassword(this.auth, this.Email.value, '12345678')
            .then((credentials) => {
                set(ref(this.db, 'User/' + credentials.user.uid), {
                    FullName: this.User.value,
                    Email: this.Email.value,
                    Address: this.Address.value,
                    Birth: this.Birth.value,
                    Phone: this.Phone.value,
                    Role: (this.Role.value == 'admin'),
                    CreateDate: formattedDate,
                    UpdateDate: formattedDate
                });
            })
            .then(() => {
                alert("Thêm người dùng thành công");
                location.reload();
            })
            .catch((error) => {
                alert(error.message);
                console.log(error.code);
                console.log(error.message);
            });
    }
}

const userManager = new UserManager();