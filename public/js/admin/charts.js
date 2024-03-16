document.addEventListener("DOMContentLoaded", async () => {
    const response = await axios.get("/admin/chart");
    const signupChart = response.data.chartData;

    if (response.status == 200) {
        // Creating chart for signups
        const signupCtx = document.getElementById('myChart');
        new Chart(signupCtx, {
            type: 'bar',
            data: {
                labels: signupChart.labels,
                datasets: [{
                    label: '# of Signups',
                    data: signupChart.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
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

        // Creating chart for orders
        const orderGraph = document.getElementById('myChartOrder');
        const orderData = response.data.orderData;
        const labels = orderData.map(result => result._id); // Month numbers
        const totalAmounts = orderData.map(result => result.count); // Total order counts

        new Chart(orderGraph, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Orders',
                    data: totalAmounts,
                    fill: false,
                    borderColor: 'red',
                    tension: 0.1
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



        // Creating chart for products
        const productGraph = document.getElementById('myChartProducts')
        const productData = response.data.productData
        console.log(productData);

                
        // Prepare data for Chart.js
        const categoryLabels = Object.keys(productData);
        const productCounts = Object.values(productData);

        // Render doughnut chart
        new Chart(productGraph, {
            type: "doughnut",
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: "Products by Category",
                    data: productCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                aspectRatio: 1, // Aspect ratio of 1 ensures the chart is a perfect circle
            }
        })
    }
});
