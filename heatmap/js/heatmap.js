// Задаем размер графика и поля вокруг
var margin = {
    top: 20,
    right: 100,
    bottom: 80,
    left: 70
  },
  width = 800 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// Добавляем svg оъекты на страницу
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Подписываем шкалы
var myregion_names = ["RU-BA", "RU-DA", "RU-KO", "RU-SE", "RU-MO", "RU-STA", "RU-TAM", "RU-MOW", "RU-SPE", "RU-KHM"]
var myVars = ["200", "211", "212", "229", "170", "260", "403", "402", "421", "440", "450", "461", "462"]


// Шкала X:
var x = d3.scaleBand()
  .range([0, width])

  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Шкала X:
var y = d3.scaleBand()
  .range([height, 0])
  .domain(myregion_names)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y));


// Цветовая растяжка
var myColor = d3.scaleLinear()
  .range(["#ffffff", "#2b3990"]) //от какого и до какого цвета
  .domain([0, 100]) // Максимальное и минимальное значение в диапазоне которых будет цветавая растяжка

//Read the data
d3.csv("https://vittuwork.github.io/heatmap_4.csv", function(data) {


  //  Всплывающие подсказки
  var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("position", "absolute") // Описание рядом со стрелкой
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // Три функции, как будут менятся подсказки в зависимоси от наведения...
  var mouseover = function(d) {
    tooltip.style("opacity", 1)
    d3.select(this) // Подкрашивает объект серой обводкой
      .style("stroke", "gray")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(function(g) {
        return "<span style='font-size:20px;font-weight:700'>" + d.value + "%" + "</span>" + "<br/>" +
          "Регион: " + "<span style='font-size:14px;font-weight:400'>" + d.region_name + "</span>" + "<br/>" +
          "АП: " + "<span style='font-size:14px;font-weight:400'>" + d.ap_name_ru + "</span>"; // Что будет выводится в подсказке
      })
      .style("left", (d3.mouse(this)[0] + 70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
      tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // Добавление квадратиков
  svg.selectAll()
    .data(data, function(d) {
      return d.ap_code + ':' + d.iso_name;
    })
    .enter()
    .append("rect")
    .attr("x", function(d) {
      return x(d.ap_code)
    })
    .attr("y", function(d) {
      return y(d.iso_name)
    })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function(d) {
      return myColor(d.value)
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})
