//-------------------------Firre Base---------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyB8Jz_c13QWXpmPUGq0YSTePy2PgIC6HZk",
    authDomain: "esp32firebaseenxuto-74f23.firebaseapp.com",
    databaseURL: "https://esp32firebaseenxuto-74f23-default-rtdb.firebaseio.com",
    projectId: "esp32firebaseenxuto-74f23",
    storageBucket: "esp32firebaseenxuto-74f23.appspot.com",
    messagingSenderId: "747365496018",
    appId: "1:747365496018:web:0c7b360093c4b13b98a90b",
    measurementId: "G-DQ1BLET34X"
  };
   firebase.initializeApp(firebaseConfig);
   var database = firebase.database();

//------------------------------------------------------------------



var hand; // Biến để lưu trữ đối tượng đồng hồ (clock hand) cho nhiệt độ
var handHum; // Biến để lưu trữ đối tượng đồng hồ (clock hand) cho độ ẩm

am4core.ready(function () {
    am4core.useTheme(am4themes_animated); // Sử dụng giao diện đồ họa của amCharts

    // ----------------------Tạo biểu đồ cho nhiệt độ---------------------------
    var chart = am4core.create("chart_div_temp", am4charts.GaugeChart);
    chart.innerRadius = -15;

    var axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = 0;
    axis.max = 50;
    axis.strictMinMax = true;

    var colorSet = new am4core.ColorSet();

    var gradient = new am4core.LinearGradient();
    gradient.addColor(am4core.color("blue"));
    gradient.addColor(am4core.color("red"));
    axis.renderer.line.stroke = gradient;
    axis.renderer.line.strokeWidth = 15;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.labels.template.adapter.add("text", function (text) {
        return text + "'C"; // Thêm độ C sau giá trị trên nhãn
    });

    hand = chart.hands.push(new am4charts.ClockHand());
    hand.radius = am4core.percent(90); // Đặt bán kính cho đồng hồ nhiệt độ

    //-------------------------Tạo biểu đồ cho độ ẩm-----------------------------
    var chartHum = am4core.create("chart_div_hum", am4charts.GaugeChart);
    chartHum.innerRadius = -15;

    var axisHum = chartHum.xAxes.push(new am4charts.ValueAxis());
    axisHum.min = 0;
    axisHum.max = 100;
    axisHum.strictMinMax = true;

    var colorSetHum = new am4core.ColorSet();

    var gradientHum = new am4core.LinearGradient();
    gradientHum.stops.push({ color: am4core.color("white") });
    gradientHum.stops.push({ color: am4core.color("light_blue") });
    gradientHum.stops.push({ color: am4core.color("blue") });

    axisHum.renderer.line.stroke = gradientHum;
    axisHum.renderer.line.strokeWidth = 15;
    axisHum.renderer.line.strokeOpacity = 1;
    axisHum.renderer.labels.template.adapter.add("text", function (text) {
        return text + "%"; // Thêm % sau giá trị trên nhãn
    });

    axisHum.renderer.grid.template.disabled = true; // Tắt lưới

    handHum = chartHum.hands.push(new am4charts.ClockHand());
    handHum.radius = am4core.percent(90); // Đặt bán kính cho đồng hồ độ ẩm

    // ---------------Tạo biểu đồ cho AQI-----------------------------------
    
    var chartPres = am4core.create("chart_div_pres", am4charts.GaugeChart);// Tạo biểu đồ Gauge Chart và gán nó vào biến chartPres

    chartPres.innerRadius = -15;// Đặt bán kính nội của biểu đồ là -15 (để hiển thị nội dung bên trong)

    var axisPres = chartPres.xAxes.push(new am4charts.ValueAxis());    // Tạo một trục dựa trên biểu đồ và lưu vào biến axisPres

    axisPres.min = 0;
    axisPres.max = 500;

    axisPres.strictMinMax = true;    // Đảm bảo giá trị trên trục áp suất không vượt quá khoảng từ min đến max

    var gradientPres = new am4core.LinearGradient();    // Tạo một đối tượng Linear Gradient (gradient tuyến tính)

    // Thêm màu sắc vào gradient
    gradientPres.addColor(am4core.color("yellow"));
    gradientPres.addColor(am4core.color("blue"));
    gradientPres.addColor(am4core.color("red"));

    axisPres.renderer.line.stroke = gradientPres;    // Đặt gradientPres làm màu cho đường line của trục áp suất
    axisPres.renderer.line.strokeWidth = 15;    // Đặt độ dày của đường line của trục áp suất là 15
    axisPres.renderer.line.strokeOpacity = 1;    // Đặt độ trong suốt của đường line là 1 (hoàn toàn trong suốt)


    // Sử dụng adapter để tùy chỉnh nội dung của nhãn trên trục áp suất
    axisPres.renderer.labels.template.adapter.add("text", function (text) {
        return text + ""; // Giữ nguyên giá trị của nhãn
    });

    handPres = chartPres.hands.push(new am4charts.ClockHand());    // Tạo một đồng hồ (ClockHand) và đưa nó vào biểu đồ áp suất
    handPres.radius = am4core.percent(90);    // Đặt bán kính của đồng hồ áp suất là 90% của biểu đồ


    //------------------------------------------------------------------------
});

// ---------------------Tạo hiệu ứng chuyển động-------------------------------
/*
setInterval(function () {
    hand.showValue(Math.random() * 50, 1000, am4core.ease.cubicOut); // Hiển thị giá trị nhiệt độ ngẫu nhiên
    handHum.showValue(Math.random() * 100, 1000, am4core.ease.cubicOut); // Hiển thị giá trị độ ẩm ngẫu nhiên
    handPres.showValue(Math.random() * 0.3 + 0.8, 1000, am4core.ease.cubicOut); // Hiển thị giá trị áp suất ngẫu nhiên
}, 2000); // Cập nhật giá trị mỗi 2 giây
*/
const temperatureRef = database.ref("/Receiver/Number2");//Nhiệt độ
const humidityRef = database.ref("/Receiver/Number1");   // Độ ẩm
const pressureRef = database.ref("/Receiver/Number0");   //AQI
//---------------------------Display----------------------------------------
setInterval(function () {

database.ref("/Receiver/Number2").on("value",function(snapshot){  // Nhiệt độ
    var temp = snapshot.val();
    document.getElementById("temp-value").innerHTML=temp;
    hand.showValue(temp, 1000, am4core.ease.cubicOut);
})

database.ref("/Receiver/Number1").on("value",function(snapshot){  // Độ ẩm
    var hum = snapshot.val();
    document.getElementById("hum-value").innerHTML=hum;
    handHum.showValue(hum, 1000, am4core.ease.cubicOut);
})

database.ref("/Receiver/Number0").on("value",function(snapshot){  // AQI
    var pres = snapshot.val();
    document.getElementById("pres-value").innerHTML=pres;

    handPres.showValue(pres, 1000, am4core.ease.cubicOut);
})

})
//-----------------------------------------------------------------------------------------------------------------------------------------------

const chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };
  
  var index = 0;
  
  setInterval(myTimer, 1000);
  setInterval(updateChart, 3000);
  
  function myTimer() {
    var d = new Date();
    document.getElementById("demo").innerHTML = d.toLocaleTimeString();
  }
  
  function updateChart() {

    temperatureRef.on("value", function(snapshot) {
        const temperatureValue = snapshot.val();
        n2 = temperatureValue; // Cập nhật giá trị nhiệt độ từ Firebase
    });
    
    humidityRef.on("value", function(snapshot) {
        const humidityValue = snapshot.val();
        n = humidityValue; // Cập nhật giá trị độ ẩm từ Firebase
    });


    index++;
    if (index > 20) {
      lineChart.data.labels.shift();
      lineChart.data.datasets[0].data.shift();
      lineChart.data.datasets[1].data.shift();
    }
    lineChart.data.labels.push(index);
    lineChart.data.datasets[0].data.push(n);
    lineChart.data.datasets[1].data.push(n2);
    lineChart.update();
  }

  //---------------Thiết lập biểu đồ-----------------------------
  
  const CHART = document.getElementById('lineChart');
  var lineChart = new Chart(CHART, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: "Humidity",
        fill: false,
        lineTension: 0.2, // Đặt giá trị lineTension thành 0.2 để tạo đường cong
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJointStyle: 'miter',
        data: []
      },
      {
        label: "Temperature",
        fill: false,
        lineTension: 0.2, // Đặt giá trị lineTension thành 0.2 để tạo đường cong
        backgroundColor: "rgba(255, 206, 86,0.4)",
        borderColor: chartColors.orange,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJointStyle: 'miter',
        data: []
      }]
    },
  });
  //------------------------------------------------------
  function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  }
  
  function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }