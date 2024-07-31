import { logout } from "../../../firebase/logout.js";
const logoutBtn = document.getElementById('admin__sign-out');
const pathToLogin = "/CNPM_Final/index.html"
logoutBtn.addEventListener('click', () => logout(pathToLogin));

