/**
 * Schneider Electric Supply Chain Presentation - Interaction Controller
 * Manages scroll snapping, Intersection Observer, Chart.js, and Print Guard.
 * Updated: 30-slide layout (was 20-slide)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Neon Aura Mouse Follower
    // ==========================================
    const aura = document.getElementById('aura');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function animateAura() {
        auraX = lerp(auraX, mouseX, 0.08);
        auraY = lerp(auraY, mouseY, 0.08);
        if (aura) {
            aura.style.transform = `translate(calc(-50% + ${auraX}px), calc(-50% + ${auraY}px))`;
        }
        requestAnimationFrame(animateAura);
    }
    animateAura();

    // ==========================================
    // 2. Chart.js Global Config
    // ==========================================
    if (typeof Chart !== 'undefined') {
        if (typeof ChartDataLabels !== 'undefined') {
            Chart.register(ChartDataLabels);
        }
        Chart.defaults.color = '#EEF5F0';
        Chart.defaults.font.family = "'Outfit', 'Pretendard', sans-serif";
        Chart.defaults.font.size = 13;
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(6, 26, 16, 0.9)';
        Chart.defaults.plugins.tooltip.borderColor = '#3DCD58';
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.titleFont = { family: "'Outfit', sans-serif", weight: 'bold' };
        Chart.defaults.plugins.legend.labels.boxWidth = 12;
        Chart.defaults.plugins.legend.labels.padding = 15;
        Chart.defaults.set('plugins.datalabels', { display: false });
    }

    const initializedCharts = {};

    function destroyChart(id) {
        if (initializedCharts[id]) {
            initializedCharts[id].destroy();
            delete initializedCharts[id];
        }
    }

    // ==========================================
    // 3. Chart Initializers
    // ==========================================

    // Gartner Score Breakdown (Doughnut) — Slide 4
    function initChartGartner() {
        const ctx = document.getElementById('chart-gartner');
        if (!ctx || initializedCharts['chart-gartner']) return;

        initializedCharts['chart-gartner'] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['동료 임원 투표', '가트너 전문가 투표', 'ROPA', 'ROPA 변화', '매출 성장', '재고회전', 'ESG'],
                datasets: [{
                    data: [25, 25, 5, 10, 10, 5, 20],
                    backgroundColor: [
                        'rgba(61, 205, 88, 0.9)',
                        'rgba(0, 170, 255, 0.9)',
                        'rgba(255, 184, 0, 0.8)',
                        'rgba(255, 120, 50, 0.8)',
                        'rgba(180, 130, 255, 0.8)',
                        'rgba(100, 200, 200, 0.8)',
                        'rgba(255, 80, 120, 0.9)'
                    ],
                    borderColor: 'rgba(2, 10, 6, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 12 }, padding: 12 }
                    },
                    datalabels: {
                        display: function(context) {
                            var data = context.dataset.data;
                            var sorted = data.slice().sort(function(a, b) { return b - a; });
                            var threshold = sorted[3];
                            return data[context.dataIndex] >= threshold;
                        },
                        color: '#FFFFFF',
                        font: { size: 12, weight: 'bold', family: "'Outfit', sans-serif" },
                        textAlign: 'center',
                        formatter: function(value, context) {
                            var label = context.chart.data.labels[context.dataIndex];
                            return label + '\n' + value + '%';
                        },
                        anchor: 'end',
                        align: 'start',
                        offset: 8,
                        textStrokeColor: 'rgba(0,0,0,0.7)',
                        textStrokeWidth: 3
                    }
                }
            }
        });
    }

    // Top 3 Companies Bar Chart — Slide 5
    function initChartTop3() {
        const ctx = document.getElementById('chart-top3');
        if (!ctx || initializedCharts['chart-top3']) return;

        initializedCharts['chart-top3'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Schneider Electric', 'NVIDIA', 'Cisco'],
                datasets: [{
                    label: '종합점수',
                    data: [5.81, 5.66, 5.08],
                    backgroundColor: [
                        'rgba(61, 205, 88, 0.85)',
                        'rgba(0, 170, 255, 0.7)',
                        'rgba(180, 130, 255, 0.7)'
                    ],
                    borderColor: ['#3DCD58', '#00AAFF', '#B482FF'],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        min: 4.5,
                        max: 6.0,
                        ticks: { font: { size: 12 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 14, weight: 'bold' } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        color: '#FFFFFF',
                        font: { size: 16, weight: 'bold', family: "'Outfit', sans-serif" },
                        anchor: 'end',
                        align: 'left',
                        offset: 8,
                        formatter: function(value) { return value.toFixed(2); },
                        textStrokeColor: 'rgba(0,0,0,0.5)',
                        textStrokeWidth: 2
                    }
                }
            }
        });
    }

    // Market Segments (Donut) — Slide 9 (was 8)
    function initChartMarket() {
        const ctx = document.getElementById('chart-market');
        if (!ctx || initializedCharts['chart-market']) return;

        initializedCharts['chart-market'] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Data Center & Networks (30%)', 'Buildings (29%)', 'Industry (27%)', 'Infrastructure (14%)'],
                datasets: [{
                    data: [30, 29, 27, 14],
                    backgroundColor: [
                        'rgba(61, 205, 88, 0.9)',
                        'rgba(0, 170, 255, 0.85)',
                        'rgba(255, 184, 0, 0.85)',
                        'rgba(180, 130, 255, 0.8)'
                    ],
                    borderColor: 'rgba(2, 10, 6, 0.8)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '50%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 12 }, padding: 12 }
                    },
                    datalabels: {
                        display: true,
                        color: '#FFFFFF',
                        font: { size: 13, weight: 'bold', family: "'Outfit', sans-serif" },
                        textAlign: 'center',
                        formatter: function(value, context) {
                            var shortLabels = ['Data Center', 'Buildings', 'Industry', 'Infra'];
                            return shortLabels[context.dataIndex] + '\n' + value + '%';
                        },
                        anchor: 'center',
                        align: 'center',
                        offset: 0,
                        textStrokeColor: 'rgba(0,0,0,0.6)',
                        textStrokeWidth: 2
                    }
                }
            }
        });
    }

    // Forecasting MAPE Comparison (Bar) — Slide 14 (was 12)
    function initChartMAPE() {
        const ctx = document.getElementById('chart-mape');
        if (!ctx || initializedCharts['chart-mape']) return;

        initializedCharts['chart-mape'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['선형회귀 (개선 전)', '선형회귀 (개선 후)', '이중지수평활 (개선 후)'],
                datasets: [{
                    label: 'MAPE (%)',
                    data: [23, 20, 4],
                    backgroundColor: [
                        'rgba(255, 80, 80, 0.75)',
                        'rgba(255, 184, 0, 0.75)',
                        'rgba(61, 205, 88, 0.85)'
                    ],
                    borderColor: ['#FF5050', '#FFB800', '#3DCD58'],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { font: { size: 11 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                        ticks: { callback: v => v + '%' },
                        min: 0,
                        max: 30
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        color: '#FFFFFF',
                        font: { size: 16, weight: 'bold', family: "'Outfit', sans-serif" },
                        anchor: 'end',
                        align: 'top',
                        offset: 4,
                        formatter: function(value) { return value + '%'; },
                        textStrokeColor: 'rgba(0,0,0,0.5)',
                        textStrokeWidth: 2
                    }
                }
            }
        });
    }

    // Inventory Reduction (Bar) — Slide 17 (was 14)
    function initChartInventory() {
        const ctx = document.getElementById('chart-inventory');
        if (!ctx || initializedCharts['chart-inventory']) return;

        initializedCharts['chart-inventory'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['개선 전', '개선 후'],
                datasets: [
                    {
                        label: '칸반 카드 수',
                        data: [49, 24],
                        backgroundColor: 'rgba(0, 170, 255, 0.75)',
                        borderColor: '#00AAFF',
                        borderWidth: 2,
                        borderRadius: 8
                    },
                    {
                        label: '재고 비용 ($)',
                        data: [21851, 4883],
                        backgroundColor: 'rgba(61, 205, 88, 0.75)',
                        borderColor: '#3DCD58',
                        borderWidth: 2,
                        borderRadius: 8,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { font: { size: 13, weight: 'bold' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                        position: 'left',
                        title: { display: true, text: '칸반 카드', color: '#00AAFF' }
                    },
                    y1: {
                        grid: { display: false },
                        position: 'right',
                        title: { display: true, text: '재고 비용 ($)', color: '#3DCD58' }
                    }
                },
                plugins: {
                    legend: { position: 'top' },
                    datalabels: {
                        display: true,
                        color: '#FFFFFF',
                        font: { size: 14, weight: 'bold', family: "'Outfit', sans-serif" },
                        anchor: 'end',
                        align: 'top',
                        offset: 4,
                        formatter: function(value, context) {
                            if (context.dataset.yAxisID === 'y1') return '$' + value.toLocaleString();
                            return value;
                        },
                        textStrokeColor: 'rgba(0,0,0,0.5)',
                        textStrokeWidth: 2
                    }
                }
            }
        });
    }

    // Performance Radar — Slide 24 (was 18)
    function initChartPerformance() {
        const ctx = document.getElementById('chart-performance');
        if (!ctx || initializedCharts['chart-performance']) return;

        initializedCharts['chart-performance'] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['효율성', '대응성', '회복력', '지속가능성', '디지털화'],
                datasets: [{
                    label: 'Schneider Electric',
                    data: [5, 4.5, 4.5, 5, 4.8],
                    backgroundColor: 'rgba(61, 205, 88, 0.15)',
                    borderColor: '#3DCD58',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#3DCD58',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7
                }, {
                    label: '제조업 평균',
                    data: [3.5, 3, 2.5, 2.5, 2.8],
                    backgroundColor: 'rgba(0, 170, 255, 0.08)',
                    borderColor: '#00AAFF',
                    borderWidth: 1.5,
                    pointBackgroundColor: '#00AAFF',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                        pointLabels: { font: { size: 13, weight: 'bold' }, color: '#EEF5F0' },
                        ticks: { display: false, stepSize: 1 },
                        suggestedMin: 0,
                        suggestedMax: 5
                    }
                },
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // ==========================================
    // 4. Intersection Observer
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const observerOptions = {
        root: null,
        threshold: 0.52
    };

    // Updated for 30-slide layout
    const chartMap = {
        4:  { id: 'chart-gartner',     init: initChartGartner },
        5:  { id: 'chart-top3',        init: initChartTop3 },
        9:  { id: 'chart-market',      init: initChartMarket },
        14: { id: 'chart-mape',        init: initChartMAPE },
        17: { id: 'chart-inventory',   init: initChartInventory },
        24: { id: 'chart-performance', init: initChartPerformance }
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const slide = entry.target;
            const slideId = slide.id;
            const slideNum = parseInt(slideId.replace('slide-', ''));

            if (entry.isIntersecting) {
                slide.classList.add('active-slide');

                if (typeof window.transitionThreeScene === 'function') {
                    window.transitionThreeScene(slideNum);
                }

                if (chartMap[slideNum]) {
                    chartMap[slideNum].init();
                }
            } else {
                slide.classList.remove('active-slide');

                if (chartMap[slideNum]) {
                    destroyChart(chartMap[slideNum].id);
                }
            }
        });
    }, observerOptions);

    slides.forEach(slide => slideObserver.observe(slide));

    // ==========================================
    // 5. Print Guard
    // ==========================================
    window.addEventListener('beforeprint', () => {
        if (aura) aura.style.display = 'none';

        Object.values(chartMap).forEach(c => c.init());

        Object.values(initializedCharts).forEach(chart => {
            chart.options.animation = false;
            chart.update('none');
        });
    });

    window.addEventListener('afterprint', () => {
        if (aura) aura.style.display = 'block';
    });

});
