document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const mainMenu = document.getElementById('main-menu');
    const assignmentFiles = document.getElementById('assignment-files');
    const backButton = document.getElementById('back-button');
    const weekTitle = document.getElementById('week-title');
    
    // Assignment files data structure
    const weeklyFiles = {
        // TODO: Add your assignment files for each week here
        1: [
            {name: 'lab1_bai3.html', path: 'week_exercise/week1/Lab01/Vi_du/lab1_bai3.html'},
            {name: 'lab1_bai4.html', path: 'week_exercise/week1/Lab01/Vi_du/lab1_bai4.html'}
        ],
        2: [
            {name: 'lab2_bai2.html', path: 'week_exercise/week2/Lab02/Vi_du_Lab01/lab02_bai2.html'},
            {name: 'lab2_bai3.html', path: 'week_exercise/week2/Lab02/Vi_du_Lab01/lab02_bai3.html'},
        ],
        3: [
            {name: 'lab3_bai1.html', path: 'week_exercise/week3/Lab03/Vi_du_Lab01/Lab03_bai1.html'},
            {name: 'lab3_bai2.html', path: 'week_exercise/week3/Lab03/Vi_du_Lab01/Lab03_bai2.html'},
        ],
        4: [
            {name: 'lab4_bai1.html', path: 'week_exercise/week4/Lab04/Vi_du/lab04_bai1.html'},
            {name: 'lab4_bai2.html', path: 'week_exercise/week4/Lab04/Vi_du/lab04_bai2.html'},
            {name: 'lab4_bai3.html', path: 'week_exercise/week4/Lab04/Vi_du/lab04_bai3.html'},
        ],
        5: [
            {name: 'lab5_menu.html', path: 'week_exercise/week5/Lab05/lab05_menu.html'},
            {name: 'lab5_bai2+3.html', path: 'week_exercise/week5/Lab05/Bai_2/index.html'},
        ],
        6: [
            {name: 'lab06_menu_responsive.html', path: 'week_exercise/week6/Lab06/lab06_menu_responsive.html'},
            {name: 'lab6_bai2.html', path: 'week_exercise/week6/Lab06/lab06_bai2.html'},
            {name: 'lab6_bai3.html', path: 'week_exercise/week6/Lab06/lab06_bai3.html'},
        ],
        7: [
            {name: 'lab7_bai1.html', path: 'week_exercise/week7/Lab07/Vi_du/index.html'},
            {name: 'lab7_bai2.html', path: 'week_exercise/week7/Lab07/demo_bai_2/index.html'},
        ],
        8: [
            {name: 'lab8_bai1.html', path: 'week_exercise/week8/Lab08/lab08_slider.html'},
            {name: 'lab8_bai2.html', path: 'week_exercise/week8/Lab08/lab08_slider_auto.html'},
            {name: 'lab8_bai3.html', path: 'week_exercise/week8/Lab08/lab08_json.html'},
        ],
        9: [
            {name: 'lab9_bai1.html', path: 'week_exercise/week9/Lab09/lab09_bai1_jqlogin.html'},
            {name: 'lab9_bai2.html', path: 'week_exercise/week9/Lab09/lab09_bai2_jqfile.html'},
            {name: 'lab9_bai3.html', path: 'week_exercise/week9/Lab09/lab09_bai3_jqcaculate.html'},
        ],
        10: [
            {name: 'lab10.html', path: 'week_exercise/week10/Lab10/index.html'},
        ]
    };

    // Handle dropdown toggles
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');
        const arrow = button.querySelector('.arrow');
        
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.querySelector('.dropdown-content').style.display = 'none';
                    other.querySelector('.arrow').textContent = '▼';
                }
            });
            
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
            arrow.textContent = isVisible ? '▼' : '▲';
        });
    });

    // Handle week selection
    document.querySelectorAll('[data-week]').forEach(weekLink => {
        weekLink.addEventListener('click', function(e) {
            e.preventDefault();
            const weekNumber = this.getAttribute('data-week');
            showAssignmentFiles(weekNumber);
        });
    });

    // Handle back button
    backButton.addEventListener('click', function() {
        mainMenu.style.display = 'block';
        assignmentFiles.style.display = 'none';
    });

    // Function to show assignment files for a specific week
    function showAssignmentFiles(weekNumber) {
        weekTitle.textContent = `Bài tập tuần ${weekNumber}`;
        const filesGrid = assignmentFiles.querySelector('.files-grid');
        filesGrid.innerHTML = ''; // Clear existing files

        // Add files for the selected week
        if (weeklyFiles[weekNumber]) {
            weeklyFiles[weekNumber].forEach(file => {
                const fileLink = document.createElement('a');
                fileLink.href = file.path;
                fileLink.className = 'file-item';
                fileLink.innerHTML = `
                    <i class="fas fa-file-code"></i>
                    <span>${file.name}</span>
                `;
                filesGrid.appendChild(fileLink);
            });
        }

        mainMenu.style.display = 'none';
        assignmentFiles.style.display = 'block';
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.dropdown-content').style.display = 'none';
            dropdown.querySelector('.arrow').textContent = '▼';
        });
    });

    // Prevent dropdown from closing when clicking inside it
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}); 