const { performance } = require("perf_hooks");

// Завдання 1: Генерація масиву випадкових цілих чисел у діапазоні від -10 000 до 10 000
function generateRandomArray(size, min = -10000, max = 10000) {
  // Pre-allocate array for better performance on large sizes (up to 100,000,000)
  const arr = new Array(size);
  const range = max - min + 1;

  // Fill array with random integers in [min, max]
  for (let i = 0; i < size; i++) {
    arr[i] = Math.floor(Math.random() * range) + min;
  }

  return arr;
}

// Завдання 2.1: Спосіб 1 — пошук 6-го найбільшого елемента за допомогою простого сортування (Selection Sort)
function findSixthBySimpleSort(arr) {
  // Create a copy so the original dataset is not mutated between benchmark runs
  const copy = arr.slice();
  const n = copy.length;

  // Sort array in descending order using Selection Sort
  for (let i = 0; i < n - 1; i++) {
    let maxIdx = i;

    // Find the index of the maximum element in the remaining unsorted subarray
    for (let j = i + 1; j < n; j++) {
      if (copy[j] > copy[maxIdx]) {
        maxIdx = j;
      }
    }

    // Swap found maximum element with the current position
    if (maxIdx !== i) {
      const temp = copy[i];
      copy[i] = copy[maxIdx];
      copy[maxIdx] = temp;
    }
  }

  // Return the 6th largest element (0-based index 5)
  return copy[5];
}

// Завдання 2.2: Спосіб 2 — пошук 6-го найбільшого елемента за допомогою відсортованого масиву з 6 елементів
function findSixthByTopSixArray(arr) {
  // Maintain top 6 elements sorted in descending order (top6[0] is max, top6[5] is 6th max)
  const top6 = [-Infinity, -Infinity, -Infinity, -Infinity, -Infinity, -Infinity];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];

    // Compare current element only with the last (smallest) element of top6
    if (current > top6[5]) {
      let pos = 5;

      // Shift smaller elements to the right to keep top6 sorted
      while (pos > 0 && current > top6[pos - 1]) {
        top6[pos] = top6[pos - 1];
        pos--;
      }

      // Insert current element into its sorted position
      top6[pos] = current;
    }
  }

  // Return the 6th largest element
  return top6[5];
}

// Завдання 2.3: Спосіб 3 — 6-разовий пошук найбільшого елемента із заміною на найменше можливе значення
function findSixthBySixMaxPasses(arr) {
  // Clone the input array so replacing elements does not affect the source array
  const copy = arr.slice();
  let sixthMax = -Infinity;

  // Perform 6 sequential passes to find the maximum element each time
  for (let pass = 0; pass < 6; pass++) {
    let maxVal = -Infinity;
    let maxIdx = -1;

    for (let i = 0; i < copy.length; i++) {
      if (copy[i] > maxVal) {
        maxVal = copy[i];
        maxIdx = i;
      }
    }

    // Replace the found maximum with -Infinity so it is excluded from subsequent passes
    if (maxIdx !== -1) {
      copy[maxIdx] = -Infinity;
    }

    sixthMax = maxVal;
  }

  // Return the maximum found on the 6th pass
  return sixthMax;
}

// Завдання 3: Вимірювання часу роботи алгоритмів (45 перевірок) та вивід підсумкової таблиці
function measureSingleRun(fn, data) {
  // Record high-resolution timestamp before and after algorithm execution
  const start = performance.now();
  const result = fn(data);
  const end = performance.now();

  return {
    timeMs: end - start,
    result,
  };
}

function benchmarkMethod(fn, data, runs = 3) {
  const times = [];
  let lastResult = null;

  // Execute the algorithm 3 times on the same dataset
  for (let r = 0; r < runs; r++) {
    const { timeMs, result } = measureSingleRun(fn, data);
    times.push(timeMs);
    lastResult = result;
  }

  // Calculate average execution time across 3 runs
  const avg = times.reduce((sum, t) => sum + t, 0) / runs;
  const formattedAvg = avg.toFixed(2);
  const formattedRuns = times.map((t) => t.toFixed(2)).join(" ");

  return {
    formatted: `${formattedAvg}(${formattedRuns})`,
    result: lastResult,
  };
}

function runPracticalWork() {
  // Input sizes required by the assignment
  const sizes = [10_000, 100_000, 1_000_000, 10_000_000, 100_000_000];

  // Safety threshold for O(n^2) Selection Sort to avoid multi-hour freezes on n >= 1,000,000
  const MAX_SIMPLE_SORT_SIZE = 100_000;

  const tableRows = [];

  for (const size of sizes) {
    console.
