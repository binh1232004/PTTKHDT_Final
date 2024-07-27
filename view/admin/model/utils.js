class Utils {
    constructor(){

    }
    formatToVND(money){
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
    }
}
export default Utils;