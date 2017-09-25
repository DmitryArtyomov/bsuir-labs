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

function uniformDistribution(rng, count, firstNum, lastNum) {
  let numbers = rng.generateArray(count).values;
  let min = Infinity, max = -Infinity, result = [];
  numbers.forEach(function(el) {
    let num = firstNum + (lastNum - firstNum) * el;
    if (num < min) { min = num }
    if (num > max) { max = num }
    result.push(num);
  });
  return {
    min: min,
    max: max,
    values: result
  }
}

function gaussDistribution(rng, count, mathExpect, sqrDeviation, gaussStep = 6) {
  let numbers = rng.generateArray(count * gaussStep).values;
  let min = Infinity, max = -Infinity, result = [];
  for (let i = 0; i < count * gaussStep; i = i + gaussStep) {
    let sum = 0;
    for (let j = i; j < i + gaussStep; j++) {
      sum += numbers[j];
    }
    let num = mathExpect + sqrDeviation * Math.sqrt(12 / gaussStep) * (sum - gaussStep / 2);
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

function exponentialDistribution(rng, count, lambda) {
  let numbers = rng.generateArray(count).values;
  let min = Infinity, max = -Infinity, result = [];
  numbers.forEach(function(el) {
    let num = -1 / lambda * Math.log(el);
    if (num < min) { min = num }
    if (num > max) { max = num }
    result.push(num);
  });
  return {
    min: min,
    max: max,
    values: result
  }
}

function gammaDistribution(rng, count, lambda, eta) {
  let numbers = rng.generateArray(count * eta).values;
  let min = Infinity, max = -Infinity, result = [];
  for (let i = 0; i < count * eta; i = i + eta) {
    let mul = 1;
    for (let j = i; j < i + eta; j++) {
      mul *= numbers[j];
    }
    let num = - 1 / lambda * Math.log(mul);
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

function triangleDistribution(rng, count, firstNum, lastNum, type = 0) {
  let numbers = rng.generateArray(count * 2).values;
  let min = Infinity, max = -Infinity, result = [];
  let cmpFunction = (type ? Math.min : Math.max);
  for (let i = 0; i < count * 2; i = i + 2) {
    let num = firstNum + (lastNum - firstNum) * cmpFunction(numbers[i], numbers[i + 1]);
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

function simpsonDistribution(rng, count, firstNum, lastNum) {
  let numbers = uniformDistribution(rng, count * 2, firstNum, lastNum).values;
  let min = Infinity, max = -Infinity, result = [];
  for (let i = 0; i < count * 2; i = i + 2) {
    let num = numbers[i] + numbers[i + 1];
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

  document.getElementById("m_result").textContent = m;
  document.getElementById("d_result").textContent = d;
  document.getElementById("sigma_result").textContent = sigma;
}

function leaveOnlyNeededInputs(arr, total = 8) {
  for (let i = 1; i <= total; i++) {
    document.getElementById("_" + i).style.display = 'none';
  }
  arr.forEach(function(num) {
    document.getElementById("_" + num).style.display = 'flex';
  })
}

window.onload = function() {
  document.getElementById("uniformRadio").onclick = function() {
    leaveOnlyNeededInputs([1,2]);
    window.genFunction = function(rng, count) {
      let a  = parseFloat(document.getElementById("first_input").value);
      let b  = parseFloat(document.getElementById("last_input").value);
      if (!(a && b)) {
        alert("Please enter valid numbers");
        return;
      }
      return uniformDistribution(rng, count, a, b);
    }
  }
  document.getElementById("gaussRadio").onclick = function() {
    leaveOnlyNeededInputs([3,4,5]);
    window.genFunction = function(rng, count) {
      let a  = parseFloat(document.getElementById("math_expect_input").value);
      let b  = parseFloat(document.getElementById("sqr_deviation_input").value);
      let c  = parseFloat(document.getElementById("gauss_step_input").value);
      if (!(a && b && c)) {
        alert("Please enter valid numbers");
        return;
      }
      return gaussDistribution(rng, count, a, b, c);
    }
  }
  document.getElementById("expRadio").onclick = function() {
    leaveOnlyNeededInputs([6]);
    window.genFunction = function(rng, count) {
      let a  = parseFloat(document.getElementById("lambda_input").value);
      if (!a) {
        alert("Please enter valid numbers");
        return;
      }
      return exponentialDistribution(rng, count, a);
    }
  }
  document.getElementById("gammaRadio").onclick = function() {
    leaveOnlyNeededInputs([6,7]);
    window.genFunction = function(rng, count) {
      let a  = parseFloat(document.getElementById("lambda_input").value);
      let b  = parseFloat(document.getElementById("eta_input").value);
      if (!(a && b)) {
        alert("Please enter valid numbers");
        return;
      }
      return gammaDistribution(rng, count, a, b);
    }
  }
  document.getElementById("triangleRadio").onclick = function() {
    leaveOnlyNeededInputs([1,2,8]);
    window.genFunction = function(rng, count) {
      let a  = parseFloat(document.getElementById("lambda_input").value);
      let b  = parseFloat(document.getElementById("eta_input").value);
      let c  = parseInt(document.getElementById("triangle_type_input").value);
      if (!(a && b)) {
        alert("Please enter valid numbers");
        return;
      }
      return triangleDistribution(rng, count, a, b, c);
    }
  }
  document.getElementById("simpsonRadio").onclick = function() {
    leaveOnlyNeededInputs([1,2]);
    window.genFunction = function(rng, count) {
      let a  = parseFloat(document.getElementById("first_input").value);
      let b  = parseFloat(document.getElementById("last_input").value);
      if (!(a && b)) {
        alert("Please enter valid numbers");
        return;
      }
      return simpsonDistribution(rng, count, 1, 5);
    }
  }
  document.getElementById("uniformRadio").click();

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
    let genResult = window.genFunction(rng, count);
    let intervalsData = buildIntervals(genResult);
    buildChart(intervalsData, count);
    calcCharacteristics(genResult, count);
  }
}
