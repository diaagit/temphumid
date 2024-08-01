document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('visualize-temp-btn').addEventListener('click', function () {
        fetchDataAndRenderChart('Temperature');
    });

    document.getElementById('visualize-humidity-btn').addEventListener('click', function () {
        fetchDataAndRenderChart('Humidity');
    });

    function fetchDataAndRenderChart(type) {
        document.getElementById('chart-container').style.display = 'block';

        fetch('https://temphumid.onrender.com/use-existing-channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: 'value' })
        }).then(response => response.json())
          .then(data => {
              const labels = data.data.feeds.map(feed => feed.created_at);
              const tempData = data.data.feeds.map(feed => feed.field1);
              const humidityData = data.data.feeds.map(feed => feed.field2);

              const latestTemp = tempData[tempData.length - 1];
              const latestHumidity = humidityData[humidityData.length - 1];

              document.getElementById('temperature-value').innerText = `Temperature: ${latestTemp}`;
              document.getElementById('humidity-value').innerText = `Humidity: ${latestHumidity}`;

              const ctx = document.getElementById('myChart').getContext('2d');
              let chartData, chartLabel, borderColor, backgroundColor;

              if (type === 'Temperature') {
                  chartData = tempData;
                  chartLabel = 'Temperature';
                  borderColor = 'rgba(255, 99, 132, 1)';
                  backgroundColor = 'rgba(255, 99, 132, 0.2)';
              } else {
                  chartData = humidityData;
                  chartLabel = 'Humidity';
                  borderColor = 'rgba(54, 162, 235, 1)';
                  backgroundColor = 'rgba(54, 162, 235, 0.2)';
              }

              new Chart(ctx, {
                  type: 'line',
                  data: {
                      labels: labels,
                      datasets: [{
                          label: chartLabel,
                          data: chartData,
                          borderColor: borderColor,
                          backgroundColor: backgroundColor,
                          fill: true,
                      }]
                  },
                  options: {
                      responsive: true,
                      scales: {
                          x: {
                              type: 'time',
                              time: {
                                  unit: 'minute'
                              }
                          }
                      }
                  }
              });
          })
          .catch(error => console.error('Error fetching data:', error));
    }
});

