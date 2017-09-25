function Generator(a, m, r0) {
  return {
    a: a,
    m: m,
    rPrev: r0,
    generate: function() {
      this.rPrev = (a * this.rPrev) % m;
      return this.rPrev / m;
    },

    generateArray: function(count) {
      let min = 1, max = 0, result = [];
      for (let i = 0; i < count; i++) {
        num = this.generate();
        if (num < min) { min = num }
        if (num > max) { max = num }
        result.push(num);
      }
      return {
        min: min,
        max: max,
        values: result
      }
    }
  }
}

function buildIntervals(genResult) {
  let intervalLen = (genResult.max - genResult.min) / 20;
  let countsArr = Array(20).fill(0);
  genResult.values.forEach(function(value) {
    let i = Math.min(Math.floor((value - genResult.min) / intervalLen), 19);
    countsArr[i]++;
  })
  return {
    interval: intervalLen,
    offset: genResult.min,
    counts: countsArr
  }
}

function ColorGenerator(backgroundColor) {
  return {
    currentColor: 0,
    isBackground: (!!backgroundColor),
    colorStrings: [
      'rgba(255, 99, 132, ',
      'rgba(54, 162, 235, ',
      'rgba(255, 206, 86, ',
      'rgba(75, 192, 192, ',
      'rgba(153, 102, 255, ',
      'rgba(255, 159, 64, '
    ],

    generate: function() {
      return this.colorStrings[this.currentColor++ % this.colorStrings.length] + (this.isBackground ? '0.2)' : '1)');
    },

    generateArray: function(count) {
      result = [];
      for (let i = 0; i < count; i++) {
        result.push(this.generate());
      }
      return result;
    }
  }
}


function buildChart(intervalsData, testsCount) {
  if (window.chart) {
    window.chart.destroy();
  }
  let frequencies = intervalsData.counts.map(function(el) { return el / testsCount });
  let labels = [];
  for (let i = 0; i < 20; i++) {
    labels.push((intervalsData.offset + intervalsData.interval * i).toFixed(2) + ".." + (intervalsData.offset + intervalsData.interval * (i + 1)).toFixed(2))
  }
  let ctx = document.getElementById("myChart").getContext('2d');
  window.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'frequencies',
        data: frequencies,
        backgroundColor: ColorGenerator(true).generateArray(20),
        borderColor: ColorGenerator(false).generateArray(20),
        borderWidth: 1
      }, {
          label: 'expected',
          data: Array(20).fill(1/20),
          type: 'line'
        }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  });
}

function calcCharacteristics(genResult, testsCount) {
  let m = genResult.values.reduce(function(last, current) { return last + current }) / testsCount;
  let mSquared = m * m;
  let d = genResult.values.reduce(function(last, current) { return last + current * current - mSquared }) / (testsCount - 1);
  let sigma = Math.sqrt(d);

  let pairsCountK = 0;
  for (let i = 0; i < Math.floor(testsCount / 2); i++) {
    let a = genResult.values[2 * i];
    let b = genResult.values[2 * i + 1];
    if (a * a + b * b < 1) {
      pairsCountK++;
    }
  }

  let periodLength = -1;
  for (let i = 1; i < testsCount; i++) {
    if (genResult.values[0] == genResult.values[i]) {
      periodLength = i;
      break;
    }
  }

  let aperiodicLength = -1;
  for (let i = 0; i < testsCount - periodLength; i++) {
    if (genResult.values[i] == genResult.values[i + periodLength])
    {
      aperiodicLength = i + periodLength;
      break;
    }
  }

  document.getElementById("m_result").textContent = m;
  document.getElementById("d_result").textContent = d;
  document.getElementById("sigma_result").textContent = sigma;
  document.getElementById("2k_n_result").textContent = (2 * pairsCountK / testsCount);
  document.getElementById("period_result").textContent = (periodLength == -1 ? "not found" : periodLength);
  document.getElementById("aperiodic_result").textContent = (aperiodicLength == -1 ? "not found" : aperiodicLength);
}

window.onload = function() {
  document.getElementById("pi_4").textContent = Math.PI / 4;
  document.getElementById("submit").onclick = function() {
    let a  = parseFloat(document.getElementById("a_input").value);
    let m  = parseFloat(document.getElementById("m_input").value);
    let r0 = parseFloat(document.getElementById("r0_input").value);
    let count = parseInt(document.getElementById("count_input").value);
    if (!(a && m && r0 && count)) {
      alert("Please enter valid numbers");
      return;
    }
    let rng = Generator(a, m, r0);
    let genResult = rng.generateArray(count);
    let intervalsData = buildIntervals(genResult);
    buildChart(intervalsData, count);
    calcCharacteristics(genResult, count);
  }
}
