import { Database } from './database.js';

//****************************  USER_ID  ************************* */
export class UserProfile {
    constructor() {
        this.userId = localStorage.getItem('userID');
        this.database = new Database();
        this.init();
    }

    init() {
        this.userFullName = document.getElementById('user_fullName');
        this.userPhone = document.getElementById('user_phone');
        this.userAddress = document.getElementById('user_address');
        this.userEmail = document.getElementById('user_email');
        this.userBirth = document.getElementById('user_birth');
        this.userCreateDate = document.getElementById('user_createDate');
        this.updUserBtn = document.getElementById('updUser');

        document.addEventListener('DOMContentLoaded', () => this.loadUserData());
        this.updUserBtn.addEventListener('click', () => this.updateUserProfile());
    }

    loadUserData() {
        this.database.getUser(this.userId)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    this.userFullName.value = data.FullName;
                    this.userPhone.value = data.Phone;
                    this.userAddress.value = data.Address;
                    this.userEmail.value = data.Email;
                    this.userBirth.value = data.Birth;
                    this.userCreateDate.value = data.CreateDate; 
                } else {
                    alert("No data found");
                }
            })
            .catch((error) => {
                alert("Unsuccessful, error: " + error);
            });
    }

    //******************** Update user ********************
    updateUserProfile() {
        if (confirm("Do you want to save changes?")) {
            const curDate = new Date();
            const curDay = curDate.getDate();
            const curMonth = curDate.getMonth() + 1; 
            const curYear = curDate.getFullYear();
            const now = `${curDay}/${curMonth}/${curYear}`;

            const userData = {
                FullName: this.userFullName.value,
                Phone: this.userPhone.value,
                Address: this.userAddress.value,
                Email: this.userEmail.value,
                Birth: this.userBirth.value,
                CreateDate: this.userCreateDate.value, 
                UpdateDate: now, 
            };

            this.database.updateUser(this.userId, userData)
                .then(() => {
                    alert("Data stored successfully");
                })
                .catch((error) => {
                    alert("Unsuccessful, error: " + error);
                });
        } else {
            alert("Save Canceled!");
        }
    }
}
