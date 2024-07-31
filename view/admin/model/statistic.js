import Order from "./order.js";
import Utils from "./utils.js";
class Statistic {
  constructor() {
    this.lineChart = document.getElementById('salesChart');
    const utils = new Utils();
    this.currentMonth = new Date().getMonth() + 1;
    this.currentYear = new Date().getFullYear();
    this.arrDays = utils.getArrAllDaysInMonth(this.currentMonth, this.currentYear);
    // console.log(order.getArrSalesOnEachDayInOneMonth(currentMonth, currentYear));
    this.getSalesData();
    // this.addSalesChart();
  }
  async getSalesData() {
    try {
      const order = new Order();
      const salesData = await order.getArrSalesOnEachDayInOneMonth(this.currentMonth, this.currentYear);

      console.log(salesData);
      this.addSalesChart(salesData);
    } catch (err) {
      console.log(err);
    }
  }
  addSalesChart(data) {
    const ctx = this.lineChart.getContext('2d');

    // Sample data for sales on each day of a month
    const salesData = [120, 150, 180, 200, 170, 160, 190, 220, 210, 230, 250, 240, 260, 270, 280, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.arrDays,
        datasets: [{
          label: 'Doanh thu',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    document.addEventListener('DOMContentLoaded', function () {
      //BUG WHEN CREATE GRAPH IN HERE
    })
  }

}
const statistic = new Statistic();