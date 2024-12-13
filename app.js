document.addEventListener('DOMContentLoaded', () => {
    console.log("Скрипт загружен!");

    // Переключение вкладок
    const tabs = document.querySelectorAll('nav button');
    const sections = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Загрузка и отображение CSV
    const fileInput = document.getElementById('file-input');
    const loadButton = document.getElementById('load-file');
    const filePreviewTableBody = document.getElementById('file-preview').querySelector('tbody');
    const editTableBody = document.getElementById('edit-table').querySelector('tbody');

    let studentData = [];
    let editingIndex = null;

    loadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Пожалуйста, выберите файл!');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const rows = parseCSV(content, ';');
            studentData = rows.slice(1); // Пропускаем заголовок
            displayFilePreview(rows);
            displayEditTable(studentData);
        };
        reader.readAsText(file, 'windows-1251');
    });

    function parseCSV(data, delimiter) {
        const lines = data.split('\n').filter(line => line.trim());
        return lines.map(line => line.split(delimiter).map(cell => cell.trim()));
    }

    function displayFilePreview(rows) {
        filePreviewTableBody.innerHTML = '';
        rows.slice(1).forEach(row => { // Пропускаем заголовок
            const rowElement = document.createElement('tr');
            row.forEach(cell => {
                const cellElement = document.createElement('td');
                cellElement.textContent = cell;
                rowElement.appendChild(cellElement);
            });
            filePreviewTableBody.appendChild(rowElement);
        });
    }

    function displayEditTable(rows) {
        editTableBody.innerHTML = '';
        rows.forEach((row, index) => {
            const rowElement = document.createElement('tr');
            row.forEach(cell => {
                const cellElement = document.createElement('td');
                cellElement.textContent = cell;
                rowElement.appendChild(cellElement);
            });

            const editBtnCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Редактировать';
            editButton.classList.add('edit-btn');
            editButton.onclick = () => editStudent(index);
            editBtnCell.appendChild(editButton);
            rowElement.appendChild(editBtnCell);

            const deleteBtnCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteStudent(index);
            deleteBtnCell.appendChild(deleteButton);
            rowElement.appendChild(deleteBtnCell);

            editTableBody.appendChild(rowElement);
        });
    }

    function editStudent(index) {
        editingIndex = index;
        const student = studentData[index];
        document.getElementById('edit-student-name').value = student[0];
        document.getElementById('edit-student-class').value = student[1];
        document.getElementById('edit-informatics').value = student[2];
        document.getElementById('edit-physics').value = student[3];
        document.getElementById('edit-mathematics').value = student[4];
        document.getElementById('edit-literature').value = student[5];
        document.getElementById('edit-music').value = student[6];
    }

    function deleteStudent(index) {
        studentData.splice(index, 1);
        displayEditTable(studentData);
    }

    // Добавление нового ученика
    const addStudentForm = document.getElementById('add-student-form');
    addStudentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newStudent = [
            document.getElementById('student-name').value,
            document.getElementById('student-class').value,
            document.getElementById('informatics').value,
            document.getElementById('physics').value,
            document.getElementById('mathematics').value,
            document.getElementById('literature').value,
            document.getElementById('music').value
        ];

        studentData.push(newStudent);
        displayEditTable(studentData); // Обновление таблицы
        addStudentForm.reset(); // Очистка формы
    });

    // Сохранение изменений ученика
    const editStudentForm = document.getElementById('edit-student-form');
    editStudentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedStudent = [
            document.getElementById('edit-student-name').value,
            document.getElementById('edit-student-class').value,
            document.getElementById('edit-informatics').value,
            document.getElementById('edit-physics').value,
            document.getElementById('edit-mathematics').value,
            document.getElementById('edit-literature').value,
            document.getElementById('edit-music').value
        ];

        if (editingIndex !== null) {
            studentData[editingIndex] = updatedStudent;
            editingIndex = null;  // Сброс индекса редактируемого ученика
        }

        displayEditTable(studentData); // Обновление таблицы
    });

    // Скачать измененный файл
    const downloadButton = document.getElementById('download-file');
    downloadButton.addEventListener('click', () => {
        const csvData = generateCSV(studentData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'students.csv';
        link.click();
    });

    function generateCSV(rows) {
        const header = ['Имя', 'Класс', 'Информатика', 'Физика', 'Математика', 'Литература', 'Музыка'];
        const csvRows = [header.join(';')];
        rows.forEach(row => {
            csvRows.push(row.join(';'));
        });
        // Кодировка UTF-8
        return '\uFEFF' + csvRows.join('\n');
    }
    // Функция для вычисления медианы
    function calculateMedian(values) {
        values.sort((a, b) => a - b);
        const half = Math.floor(values.length / 2);
        return values.length % 2 === 0 ? (values[half - 1] + values[half]) / 2 : values[half];
    }

    // Основной код для генерации статистики
    function generateClassStats(classData) {
        const subjects = ['Информатика', 'Физика', 'Математика', 'Литература', 'Музыка'];
        const classStatsDiv = document.getElementById('class-stats');
        const graphStatsDiv = document.getElementById('class-graph-stats');
        classStatsDiv.innerHTML = '';
        graphStatsDiv.innerHTML = '';

        Object.entries(classData).forEach(([className, students]) => {
            let avgGrades = [];
            let medianGrades = [];

            subjects.forEach(subject => {
                const subjectGrades = students.map(student => parseInt(student[subject]));
                const avgGrade = (subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length).toFixed(2);
                const medianGrade = calculateMedian(subjectGrades);
                const gradeCounts = [1, 2, 3, 4, 5].map(grade => subjectGrades.filter(g => g === grade).length);
                const gradePercents = gradeCounts.map(count => ((count / subjectGrades.length) * 100).toFixed(2));

                avgGrades.push(parseFloat(avgGrade));
                medianGrades.push(parseFloat(medianGrade));

                // Create and add the table for grade distribution
                const table = document.createElement('table');
                table.classList.add('stats-table');
                table.innerHTML = `
                    <caption>${className} - ${subject}</caption>
                    <thead>
                        <tr>
                            <th>Средняя оценка</th>
                            <th>Медиана</th>
                            <th colspan="2">5</th>
                            <th colspan="2">4</th>
                            <th colspan="2">3</th>
                            <th colspan="2">2</th>
                            <th colspan="2">1</th>
                        </tr>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Кол-во учеников</th>
                            <th>%</th>
                            <th>Кол-во учеников</th>
                            <th>%</th>
                            <th>Кол-во учеников</th>
                            <th>%</th>
                            <th>Кол-во учеников</th>
                            <th>%</th>
                            <th>Кол-во учеников</th>
                            <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${avgGrade}</td>
                            <td>${medianGrade}</td>
                            <td>${gradeCounts[4]}</td>
                            <td>${gradePercents[4]}</td>
                            <td>${gradeCounts[3]}</td>
                            <td>${gradePercents[3]}</td>
                            <td>${gradeCounts[2]}</td>
                            <td>${gradePercents[2]}</td>
                            <td>${gradeCounts[1]}</td>
                            <td>${gradePercents[1]}</td>
                            <td>${gradeCounts[0]}</td>
                            <td>${gradePercents[0]}</td>
                        </tr>
                    </tbody>
                `;
                classStatsDiv.appendChild(table);

                // Create and add the chart for grade distribution
                const chartContainer = document.createElement('div');
                chartContainer.classList.add('chart-container');
                const canvas = document.createElement('canvas');
                chartContainer.appendChild(canvas);
                graphStatsDiv.appendChild(chartContainer);

                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: ['1', '2', '3', '4', '5'],
                        datasets: [{
                            label: `${className} - ${subject}`,
                            data: gradeCounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 10,
                                title: {
                                    display: true,
                                    text: 'Количество учеников',
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Оценки',
                                }
                            }
                        }
                    }
                });
            });

            // Create the chart for average and median grades
            const avgMedianChartContainer = document.createElement('div');
            avgMedianChartContainer.classList.add('chart-container');
            const avgMedianCanvas = document.createElement('canvas');
            avgMedianChartContainer.appendChild(avgMedianCanvas);
            graphStatsDiv.appendChild(avgMedianChartContainer);

            new Chart(avgMedianCanvas, {
                type: 'line',
                data: {
                    labels: subjects,
                    datasets: [
                        {
                            label: 'Средняя оценка',
                            data: avgGrades,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false
                        },
                        {
                            label: 'Медиана',
                            data: medianGrades,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            title: {
                                display: true,
                                text: 'Оценки'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Предметы'
                            }
                        }
                    }
                }
            });
        });
    }

    function generateOverallStudentStats(students) {
        const subjects = ['Информатика', 'Физика', 'Математика', 'Литература', 'Музыка'];
        const overallStatsDiv = document.getElementById('all-students-stats');
        const overallGraphStatsDiv = document.getElementById('all-students-graph-stats');
        overallStatsDiv.innerHTML = '';
        overallGraphStatsDiv.innerHTML = '';

        let overallAvgGrades = [];
        let overallMedianGrades = [];

        subjects.forEach((subject, index) => {
            // Собираем оценки по предмету
            const subjectGrades = students
                .map(student => parseInt(student[index + 2])) // Индексы с 2-го элемента
                .filter(grade => !isNaN(grade)); // Исключаем NaN

            if (subjectGrades.length === 0) {
                overallAvgGrades.push(0);
                overallMedianGrades.push(0);
                return;
            }

            const avgGrade = (subjectGrades.reduce((sum, grade) => sum + grade, 0) / subjectGrades.length).toFixed(2);
            const medianGrade = calculateMedian(subjectGrades);
            overallAvgGrades.push(parseFloat(avgGrade));
            overallMedianGrades.push(parseFloat(medianGrade));

            // Создаем таблицу статистики
            const table = document.createElement('table');
            table.classList.add('stats-table');
            table.innerHTML = `
                <caption>Общая статистика - ${subject}</caption>
                <thead>
                    <tr>
                        <th>Средняя оценка</th>
                        <th>Медиана</th>
                        <th colspan="2">5</th>
                        <th colspan="2">4</th>
                        <th colspan="2">3</th>
                        <th colspan="2">2</th>
                        <th colspan="2">1</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Кол-во</th>
                        <th>%</th>
                        <th>Кол-во</th>
                        <th>%</th>
                        <th>Кол-во</th>
                        <th>%</th>
                        <th>Кол-во</th>
                        <th>%</th>
                        <th>Кол-во</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${avgGrade}</td>
                        <td>${medianGrade}</td>
                        ${[5, 4, 3, 2, 1].map(grade => `
                            <td>${subjectGrades.filter(g => g === grade).length}</td>
                            <td>${((subjectGrades.filter(g => g === grade).length / subjectGrades.length) * 100).toFixed(2)}</td>
                        `).join('')}
                    </tr>
                </tbody>
            `;
            overallStatsDiv.appendChild(table);

            // Подготовка данных для графика
            const gradeCounts = [5, 4, 3, 2, 1].map(grade => subjectGrades.filter(g => g === grade).length);

            // Создаем график распределения оценок
            const chartContainer = document.createElement('div');
            chartContainer.classList.add('chart-container');
            const canvas = document.createElement('canvas');
            chartContainer.appendChild(canvas);
            overallGraphStatsDiv.appendChild(chartContainer);

            new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: ['5', '4', '3', '2', '1'], // Оценки
                    datasets: [{
                        label: `Распределение оценок - ${subject}`,
                        data: gradeCounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 30,
                            title: {
                                display: true,
                                text: 'Количество учеников',
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Оценки',
                            }
                        }
                    }
                }
            });
        });

        // Генерируем график средних оценок и медиан
        const avgMedianChartContainer = document.createElement('div');
        avgMedianChartContainer.classList.add('chart-container');
        const avgMedianCanvas = document.createElement('canvas');
        avgMedianChartContainer.appendChild(avgMedianCanvas);
        overallGraphStatsDiv.appendChild(avgMedianChartContainer);

        new Chart(avgMedianCanvas, {
            type: 'line',
            data: {
                labels: subjects,
                datasets: [
                    {
                        label: 'Средняя оценка',
                        data: overallAvgGrades,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false
                    },
                    {
                        label: 'Медиана',
                        data: overallMedianGrades,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        title: {
                            display: true,
                            text: 'Оценки'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Предметы'
                        }
                    }
                }
            }
        });
    }

    // Обработчики событий для переключения вкладок
    document.querySelector('button[data-tab="table-stats"]').addEventListener('click', () => {
        const classData = {};

        studentData.forEach(student => {
            const className = student[1];
            if (!classData[className]) classData[className] = [];
            classData[className].push({
                'Имя': student[0],
                'Информатика': student[2],
                'Физика': student[3],
                'Математика': student[4],
                'Литература': student[5],
                'Музыка': student[6]
            });
        });

        generateClassStats(classData);
        generateOverallStudentStats(studentData);

        // Показываем вкладку с таблицами
        document.getElementById('table-stats').classList.add('active');
        document.getElementById('graph-stats').classList.remove('active');
    });

    document.querySelector('button[data-tab="graph-stats"]').addEventListener('click', () => {
        if (studentData.length === 0) {
            alert('Нет данных для отображения статистики.');
            return;
        }

        generateOverallStudentStats(studentData); // Генерация графиков
        document.getElementById('table-stats').classList.remove('active');
        document.getElementById('graph-stats').classList.add('active');
    });
});
