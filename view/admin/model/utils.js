class Utils {
    constructor(){
        this.ROLE = {
            USER: 1,
            ADMIN: 2,
            WAREHOUSE: 3
        }
    }
    formatToVND(money){
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
    }
    getRoleName(role){
        switch(role){
            case this.ROLE.USER:
                return 'User';
            case this.ROLE.ADMIN:
                return 'Admin';
            case this.ROLE.WAREHOUSE:
                return 'Warehouse';
        }
    }
}
export default Utils;